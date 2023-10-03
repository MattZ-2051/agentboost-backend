import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { GmcService } from './gmc.service';
import { AddToCalenderDto, CreateGmcDto } from './dto/gmc.dto';
import { Listing } from 'src/listing/listing.entity';

@Controller('gmc')
export class GmcController {
  constructor(private readonly gmcService: GmcService) {}

  @UseGuards()
  @Post('/create')
  async createGmc(@Body() createGmcDto: CreateGmcDto): Promise<Listing> {
    return await this.gmcService.createGmc(createGmcDto);
  }

  @UseGuards()
  @Patch('/addToCalender')
  async addToCalender(
    @Body() addToCalenderDto: AddToCalenderDto,
  ): Promise<Listing> {
    return await this.gmcService.addGmcToCalender(addToCalenderDto);
  }
}
