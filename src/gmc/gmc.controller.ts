import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GmcService } from './gmc.service';
import { CreateGmcDto } from './dto/gmc.dto';
import { Listing } from 'src/listings/listings.entity';

@Controller('gmc')
export class GmcController {
  constructor(private readonly gmcService: GmcService) {}

  @UseGuards()
  @Post('/create')
  async createGmc(@Body() createGmcDto: CreateGmcDto): Promise<Listing> {
    return await this.gmcService.createGmc(createGmcDto);
  }
}
