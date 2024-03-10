import { Controller, Body, UseGuards, Post } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}
  @UseGuards(AtGuard)
  @Post('/create')
  async getUserCampaigns(@Body() dto: CreateCampaignDto): Promise<any> {
    return await this.campaignService.createCampaign(dto);
  }
}
