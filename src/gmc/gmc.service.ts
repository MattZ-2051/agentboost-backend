import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gmc } from './gmc.entity';
import { DataSource, Repository } from 'typeorm';
import { AddToCalenderDto, CreateGmcDto } from './dto/gmc.dto';
import { ListingsService } from 'src/listing/listing.service';
import { Listing } from 'src/listing/listing.entity';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class GmcService {
  constructor(
    @InjectRepository(Gmc) private readonly gmcRepo: Repository<Gmc>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ListingsService))
    private readonly listingsService: ListingsService,
    private readonly geminiService: GeminiService,
  ) {}

  async addGmcToCalender(dto: AddToCalenderDto): Promise<Listing> {
    const listing = await this.listingsService.findOne('id', dto.listingId, [
      'gmcs',
    ]);

    if (listing?.gmcs?.length > 0) {
      let date = new Date(dto.startDate)
        .toISOString()
        .replace('-', '/')
        .split('T')[0]
        .replace('-', '/');

      for (const data of listing.gmcs) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        const gmc = await this.gmcRepo.update(
          {
            id: data.id,
          },
          {
            ...data,
            calenderDate: date,
          },
        );

        if (gmc.affected === 1) {
          const updatedGmc = await this.gmcRepo.findOne({
            where: {
              id: data.id,
            },
          });
          try {
            await queryRunner.manager.save(updatedGmc);
            await queryRunner.commitTransaction();
            const dateEvent = new Date(date);
            dateEvent.setDate(dateEvent.getDate() + 7);
            date = new Date(dateEvent)
              .toISOString()
              .replace('-', '/')
              .split('T')[0]
              .replace('-', '/');
          } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException('error updating gmc', 500);
          } finally {
            await queryRunner.release();
          }
        } else {
          throw new HttpException('error updating gmc', 500);
        }
      }
      return listing;
    } else {
      throw new HttpException('no gmcs exist on listing', 400);
    }
  }

  async createGmc(dto: CreateGmcDto): Promise<Listing> {
    const listing = await this.listingsService.findOne('id', dto.listingId, [
      'gmcs',
    ]);

    if (listing?.gmcs?.length === 0) {
      delete dto.listingId;
      const gmcData = await this.geminiService.generateGmcForListing(dto);
      const createdGmc: Gmc[] = [];

      if (gmcData.firstCaption) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        const newItem = await this.gmcRepo.create({
          caption: gmcData.firstCaption,
          listing,
        });

        try {
          await queryRunner.manager.save(newItem);
          await queryRunner.commitTransaction();
          createdGmc.push(newItem);
        } catch (err) {
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          throw new HttpException('error updating listings', 500);
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
      }
      if (gmcData.otherCaptions.length > 0) {
        for (const newGmcCaption of gmcData.otherCaptions) {
          const queryRunner = this.dataSource.createQueryRunner();
          await queryRunner.startTransaction();
          const newItem = await this.gmcRepo.create({
            caption: newGmcCaption,
            listing,
          });
          try {
            await queryRunner.manager.save(newItem);
            await queryRunner.commitTransaction();
            createdGmc.push(newItem);
          } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            throw new HttpException('error updating listings', 500);
          } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
          }
        }
      } else {
        throw new HttpException('missing data for gmc', 400);
      }

      const newListing = await this.listingsService.findOne(
        'id',
        dto.listingId,
        ['gmcs'],
      );

      return newListing;
    } else {
      return listing;
    }
  }
}
