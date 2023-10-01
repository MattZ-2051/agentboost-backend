import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RealtyService } from './realty.service';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { RealtyMoleData } from './types/realty.types';

@Controller('realty')
export class RealtyController {
  constructor(private readonly realtyService: RealtyService) {}

  @UseGuards(AtGuard)
  @Get('/properties/:address')
  async getPropertyInfo(
    @Param() params: { address: string },
  ): Promise<RealtyMoleData> {
    const address = params.address;
    return await this.realtyService.getPropertyListingData({ address });
  }
}
