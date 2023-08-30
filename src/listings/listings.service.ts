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

@Injectable()
export class ListingsService {
  constructor(
    private readonly gptService: GptService,
    private readonly realtyService: RealtyService,
    private readonly dataSource: DataSource,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async getPropertyDescription({
    address,
    keyInfo,
    agentProfile,
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
        agentProfile,
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
    const listingExists = await this.listingRepo.findOneBy({
      address: dto.address,
    });

    let listing;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    if (listingExists) {
      listing = await this.listingRepo.update(
        { id: listingExists.id },
        { ...dto },
      );

      if (listing.affected === 1) {
        const updatedListing = await this.listingRepo.findOneBy({
          address: dto.address,
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
      listing = await this.listingRepo.create(dto);

      try {
        await queryRunner.manager.save(listing);
        await queryRunner.commitTransaction();
        return listing;
      } catch (err) {
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
        throw new HttpException('error creating listing, missing fields', 400);
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
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
