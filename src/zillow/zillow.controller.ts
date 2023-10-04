import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ZillowService } from './zillow.service';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { ZillowPropertyInfo } from './types/zillow.types';

@Controller('zillow')
export class ZillowController {
  constructor(private readonly zillowService: ZillowService) {}

  @UseGuards(AtGuard)
  @Get('/property/:address')
  async getPropertyInfo(
    @Param() params: { address: string },
  ): Promise<ZillowPropertyInfo> {
    const address = params.address;
    return await this.zillowService.getPropertyInfo({ address });
  }
}
