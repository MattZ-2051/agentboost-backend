import { Injectable, HttpException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPropertyDescriptionDto } from './dto/listings.dto';
import { GptService } from 'src/gpt/gpt.service';
import { RealtyService } from 'src/realty/realty.service';
import { CreateListingDto } from './dto/listings.dto';
import { Listing } from './listings.entity';
import type { ChatCompletionResponseMessage } from 'openai';
import { RealtyMoleData } from 'src/realty/types/realty.types';
import { UserService } from '..//user/user.service';

@Injectable()
export class ListingsService {
  constructor(
    private readonly gptService: GptService,
    private readonly usersService: UserService,
    private readonly realtyService: RealtyService,
    private readonly dataSource: DataSource,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async getPropertyDescription({
    address,
    keyInfo,
  }: GetPropertyDescriptionDto): Promise<{
    choices: ChatCompletionResponseMessage[];
    realtyMoleData: RealtyMoleData;
  }> {
    const realtyMoleData = await this.realtyService.getPropertyListingData({
      address,
    });

    if (realtyMoleData) {
      const gptResponse = await this.gptService.generateDescriptionForListing({
        address,
        keyInfo,
        realtyMoleData,
      });
      if (gptResponse.choices.length > 0) {
        return {
          choices: gptResponse.choices.map((content) => content.message),
          realtyMoleData,
        };
      }
    }
  }

  async createListing(dto: CreateListingDto): Promise<Listing> {
    const gptResponse = await this.gptService.generatePropertyInsightForListing(
      {
        subdivision: dto.subdivision || 'raintree',
        avgDays: '23',
        pricePerFoot: '$500',
        soldPrice: '$200,000',
        avgLotSize: '.30',
        appreciationAvg: '10%',
        lotSize: '.23',
      },
    );

    if (gptResponse.choices.length > 0) {
      const propertyInsight = gptResponse.choices[0].message.content;
      const listingExists = await this.listingRepo.findOne({
        where: {
          formattedAddress: dto.formattedAddress,
        },
        relations: ['user'],
      });

      const listingCreator = await this.usersService.findOne('id', dto.userId);

      let listing;
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      if (listingExists) {
        delete dto.userId;

        listing = await this.listingRepo.update(
          { id: listingExists.id },
          {
            ...dto,
            user: listingCreator,
            propertyInsight: propertyInsight as unknown as string,
          },
        );

        if (listing.affected === 1) {
          const updatedListing = await this.listingRepo.findOne({
            where: {
              formattedAddress: dto.formattedAddress,
            },
          });

          try {
            await queryRunner.manager.save(updatedListing);
            await queryRunner.commitTransaction();
            return updatedListing;
          } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            throw new HttpException('error updating listings', 500);
          } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
          }
        } else {
          throw new HttpException('Error logging user out', 500);
        }
      } else {
        listing = await this.listingRepo.create({
          ...dto,
          user: listingCreator,
          propertyInsight: propertyInsight as unknown as string,
        });

        try {
          await queryRunner.manager.save(listing);
          await queryRunner.commitTransaction();
          return listing;
        } catch (err) {
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          throw new HttpException(
            'error creating listing, missing fields',
            400,
          );
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
      }
    }
  }
  async findOne(key: string, val: string | number): Promise<Listing | null> {
    const listing = await this.listingRepo.findOneBy({ [key]: val });

    if (listing) {
      return listing;
    } else {
      throw new HttpException('listing does not exist', 400);
    }
  }
}
