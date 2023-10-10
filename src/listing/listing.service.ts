import { Injectable, HttpException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPropertyDescriptionDto } from './dto/listings.dto';
import { GptService } from '../gpt/gpt.service';
import { RealtyService } from 'src/realty/realty.service';
import { CreateListingDto, CreateCmaDto } from './dto/listings.dto';
import { Listing } from './listing.entity';
import type { ChatCompletionResponseMessage } from 'openai';
import { UserService } from '../user/user.service';
import { ZillowService } from 'src/zillow/zillow.service';
import { ZillowPropertyInfo } from 'src/zillow/types/zillow.types';

@Injectable()
export class ListingsService {
  constructor(
    private readonly gptService: GptService,
    private readonly usersService: UserService,
    private readonly realtyService: RealtyService,
    private readonly zillowService: ZillowService,
    private readonly dataSource: DataSource,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  /**
   *
   * @param {address} - address of property from frontend formatted in address, city, state
   * @param {keyInfo} - additional info provided by user to help with chat gpt description
   * @returns {choices, zillowInfo} - choices is the chat gpt response and zillowInfo is response from zilow api
   */

  async getPropertyDescription({
    address,
    keyInfo,
  }: GetPropertyDescriptionDto): Promise<{
    choices: ChatCompletionResponseMessage[];
    zillowInfo: ZillowPropertyInfo;
  }> {
    const zillowInfo = await this.zillowService.getPropertyInfo({ address });
    if (zillowInfo) {
      const gptResponse = await this.gptService.generateDescriptionForListing({
        address,
        keyInfo,
        zillowInfo,
      });
      if (gptResponse.choices.length > 0) {
        return {
          choices: gptResponse.choices.map((content) => content.message),
          zillowInfo,
        };
      }
    }
  }

  // private async _getCmaImages(cma: any[]): Promise<SaleListing[]> {
  //   const newCma: SaleListing[] = [];
  //   function delay(t) {
  //     return new Promise((resolve) => setTimeout(resolve, t));
  //   }

  //   for (const item of cma) {
  //     await delay(3000);
  //     const response = await this.zillowService.getPropertyImages({
  //       address: item.formattedAddress,
  //     });
  //     item['zillowImages'] = response;
  //     newCma.push(item);
  //   }
  //   return newCma;
  // }

  // private _filterCma(
  //   realtyMoleResponse: SaleListing[],
  //   listing: Listing,
  // ): SaleListing[] {
  //   const bedBoundary = {
  //     max: listing.bedrooms + 1,
  //     min: listing.bedrooms - 1,
  //   };

  //   const lotSizeBoundary = {
  //     max: listing.lotSize + 0.2 * listing.lotSize,
  //     min: listing.lotSize - 0.2 * listing.lotSize,
  //   };

  //   const squareFootageBoundary = {
  //     max: listing.squareFootage + 0.15 * listing.squareFootage,
  //     min: listing.squareFootage - 0.15 * listing.squareFootage,
  //   };

  //   const limits = {
  //     bedBoundary,
  //     lotSizeBoundary,
  //     squareFootageBoundary,
  //   };
  //   const cma: SaleListing[] = [];

  //   for (const item of realtyMoleResponse) {
  //     if (
  //       item.bedrooms >= limits.bedBoundary.min &&
  //       item.bedrooms <= limits.bedBoundary.max &&
  //       item.squareFootage >= limits.squareFootageBoundary.min &&
  //       item.squareFootage <= limits.squareFootageBoundary.max
  //     ) {
  //       cma.push(item);
  //     }
  //   }

  //   return cma;
  // }

  async createCma(dto: CreateCmaDto, listingId: string): Promise<Listing> {
    const realtyServiceDto = {
      address: dto.address,
      radius: dto.radius,
      status: dto.status,
    };
    const realtyMoleResponse = await this.realtyService.getPropertyCma(
      realtyServiceDto,
    );

    const listingExist = await this.listingRepo.findOneBy({
      id: parseInt(listingId, 10),
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    if (listingExist) {
      if (realtyMoleResponse) {
        // const cma = this._filterCma(realtyMoleResponse, listingExist);
        const cma = [];
        if (cma.length < 3) {
          return await this.createCma(
            {
              address: dto.address,
              radius: dto.radius + 3,
              status: dto.status,
            },
            listingExist.id.toString(),
          );
        } else {
          let newCma = cma.slice(0, 4);
          // newCma = await this._getCmaImages(newCma);
          const updatedListing = await this.listingRepo.update(
            { id: listingExist.id },
            {
              cma: JSON.parse(JSON.stringify(newCma)),
            },
          );

          if (updatedListing.affected === 1) {
            const listing = await this.listingRepo.findOne({
              where: {
                id: listingExist.id,
              },
            });
            try {
              await queryRunner.manager.save(listing);
              await queryRunner.commitTransaction();
              return listing;
            } catch (err) {
              // since we have errors lets rollback the changes we made
              await queryRunner.rollbackTransaction();
              throw new HttpException('error updating listing', 500);
            } finally {
              // you need to release a queryRunner which was manually instantiated
              await queryRunner.release();
            }
          } else {
            throw new HttpException('error updating listing', 500);
          }
        }
      }
    } else {
      throw new HttpException('no listing exists with this id', 400);
    }
  }

  async createListing(dto: CreateListingDto): Promise<Listing> {
    const listing = await this.listingRepo.findOneBy({
      zpid: dto.zpid,
    });

    if (listing) {
      return listing;
    } else {
      const propertyInsightData = await this.zillowService.getPropertyComps(
        dto.zpid.toString(),
      );

      console.log('data', propertyInsightData);

      // const propertyInsights = await this.gptService.generatePropertyInsightForListing(
      //   {
      //     pool: propertyInsightData,
      //     radius: 2,
      //     bedrooms: dto.bedrooms,
      //     lotSize: dto.lotSize,
      //     squareFt: dto.
      //   },
      // )
      // const propertyInsight = [];
      // const newListing = this.listingRepo.create({
      //   ...dto,
      // });
      // const queryRunner = this.dataSource.createQueryRunner();
      // await queryRunner.startTransaction();
      // try {
      //   await queryRunner.manager.save(newListing);
      //   await queryRunner.commitTransaction();
      //   return newListing;
      // } catch (err) {
      //   // since we have errors lets rollback the changes we made
      //   await queryRunner.rollbackTransaction();
      //   throw new HttpException('error creating new listing', 500);
      // } finally {
      //   // you need to release a queryRunner which was manually instantiated
      //   await queryRunner.release();
      // }
    }
  }

  async findOne(
    key: string,
    val: string | number,
    relations?: string[],
  ): Promise<Listing | null> {
    const listing = await this.listingRepo.findOne({
      where: {
        [key]: val,
      },
      relations: relations ? relations : null,
    });

    if (listing) {
      return listing;
    } else {
      throw new HttpException('listing does not exist', 400);
    }
  }
}
