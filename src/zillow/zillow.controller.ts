import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ZillowService } from './zillow.service';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';

@Controller('zillow')
export class ZillowController {
  constructor(private readonly zillowService: ZillowService) {}

  @UseGuards(AtGuard)
  @Get(':address')
  async getImages(@Param('address') address: string) {
    return await this.zillowService.getPropertyImages({
      address,
    });
  }
}
