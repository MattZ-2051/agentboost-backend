import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CreateCampaignDto } from './dto/campaign.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async findOne(key: string, val: string | number): Promise<Campaign> {
    return this.campaignRepo.findOne({
      where: { [key]: val },
    });
  }

  async createCampaign(dto: CreateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne('title', dto.title);
    const user = await this.userService.findOne('id', dto.userId);

    if (campaign) {
      return campaign;
    } else {
      const newCampaign = await this.campaignRepo.create({
        ...dto,
        user,
      });

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.save(newCampaign);
        await queryRunner.commitTransaction();
        return newCampaign;
      } catch (err) {
        console.log('error creating campaign', err);
        await queryRunner.rollbackTransaction();
        throw new HttpException('error creating campaign', 500);
      } finally {
        await queryRunner.release();
      }
    }
  }

  async deleteCampaign(campaignId: string): Promise<DeleteResult> {
    return this.campaignRepo.delete(campaignId);
  }
}
