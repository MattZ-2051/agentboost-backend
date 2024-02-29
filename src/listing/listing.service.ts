import { Injectable, HttpException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPropertyDescriptionDto } from './dto/listings.dto';
import { GptService } from '../gpt/gpt.service';
import { CreateListingDto, CreateCmaDto } from './dto/listings.dto';
import { Listing } from './listing.entity';
import type { ChatCompletionResponseMessage } from 'openai';
import { UserService } from '../user/user.service';
import { ZillowService } from 'src/zillow/zillow.service';
import { ZillowPropertyInfo } from 'src/zillow/types/zillow.types';
import { Cma } from './types/listings.types';
import { GoogleService } from 'src/google/google.service';

@Injectable()
export class ListingsService {
  constructor(
    private readonly gptService: GptService,
    private readonly usersService: UserService,
    private readonly googleService: GoogleService,
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

  async createCma(dto: CreateCmaDto, listingId: string): Promise<Listing> {
    const activeComps = await this.zillowService.getPropertyComps(dto.zpid);

    const recentlySoldComps = await this.zillowService.getRecentlySold(
      dto.zpid,
    );

    const listingExist = await this.listingRepo.findOneBy({
      id: parseInt(listingId, 10),
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    if (listingExist) {
      if (activeComps && recentlySoldComps) {
        const activeCma: Cma[] = [];
        const recentlySoldCma: Cma[] = [];

        for (const item of activeComps) {
          const cmaItem: Cma = {
            address: item.address.streetAddress,
            bathrooms: item.bathrooms,
            bedrooms: item.bedrooms,
            price: item.price,
            squareFt: item.livingArea,
            status: item.homeStatus,
          };
          activeCma.push(cmaItem);
        }

        for (const item of recentlySoldComps) {
          const recentlySoldItem: Cma = {
            address: item.address.streetAddress,
            price: item.price,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            status: item.homeStatus,
            squareFt: item.livingArea,
          };

          recentlySoldCma.push(recentlySoldItem);
        }

        const newCma = {
          active: activeCma,
          sold: recentlySoldCma,
        };
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
    } else {
      throw new HttpException('no listing exists with this id', 400);
    }
  }

  private async _getPropertyInsightData(
    data: any[],
  ): Promise<{ avgPrice: number; avgPricePerSqFt: number; avgSqFt: number }> {
    let averagePrice = 0;
    let averagePriceDataLength = 0;
    let averagePricePerSquareFoot = 0;
    let averagePricePerSquareFootDataLength = 0;
    let averageSquareFoot = 0;
    const averageSquareFootDataLength = 0;
    for (const item of data) {
      if (item?.price) {
        averagePriceDataLength++;
        averagePrice += item.price;
      }

      if (item?.lotSize && item?.price) {
        const singleAvg = item.price / item.lotSize;
        averagePricePerSquareFoot += singleAvg;
        averagePricePerSquareFootDataLength++;
      }

      if (item?.lotSize) {
        averageSquareFoot += item.lotSize;
        averagePricePerSquareFootDataLength++;
      }
    }

    return {
      avgPrice: averagePrice / averagePriceDataLength,
      avgPricePerSqFt:
        averagePricePerSquareFoot / averagePricePerSquareFootDataLength,
      avgSqFt: averageSquareFoot,
    };
  }
  async createListing(dto: CreateListingDto): Promise<Listing> {
    const listing = await this.listingRepo.findOneBy({
      zpid: dto.zpid,
    });
    const user = await this.usersService.findOne('id', dto.userId);
    if (listing) {
      return listing;
    } else {
      const propertyComps = await this.zillowService.getPropertyComps(
        dto.zpid.toString(),
      );

      const pointsOfInterestData =
        await this.googleService.getNearbyPointsOfInterest({
          latitude: dto.latitude,
          longitude: dto.longitude,
        });

      const propertyInsightData = await this._getPropertyInsightData(
        propertyComps,
      );

      const newListing = this.listingRepo.create({
        ...dto,
        nearbyPoi: JSON.parse(JSON.stringify(pointsOfInterestData)),
        propertyInsightAvgFt: propertyInsightData.avgSqFt,
        propertyInsightAvgPrice: propertyInsightData.avgPrice,
        user,
      });

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(newListing);
        await queryRunner.commitTransaction();
        return newListing;
      } catch (err) {
        console.log('error creating listing', err);
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
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
