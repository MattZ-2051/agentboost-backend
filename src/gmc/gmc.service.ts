import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gmc } from './gmc.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGmcDto } from './dto/gmc.dto';
import { ListingsService } from 'src/listings/listings.service';
import { GptService } from 'src/gpt/gpt.service';
import { Listing } from 'src/listings/listings.entity';

@Injectable()
export class GmcService {
  constructor(
    @InjectRepository(Gmc) private readonly gmcRepo: Repository<Gmc>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ListingsService))
    private readonly listingsService: ListingsService,
    private readonly gptService: GptService,
  ) {}

  async createGmc(dto: CreateGmcDto): Promise<Listing> {
    const listing = await this.listingsService.findOne('id', dto.listingId, [
      'gmcs',
      'user',
    ]);

    if (listing?.gmcs?.length === 0) {
      delete dto.listingId;
      const gmcData = await this.gptService.generateGmcForListing(dto);
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

      return listing;
    } else {
      return listing;
    }
  }
}
