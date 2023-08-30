import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { GetPropertyDescriptionDto } from './dto/listings.dto';
import type { ChatCompletionResponseMessage } from 'openai';
import { CreateListingDto } from './dto/listings.dto';
import { Listing } from './listings.entity';
import { RealtyMoleData } from 'src/realty/types/realty.types';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(AtGuard)
  @Post('/descriptionfromAddress')
  async generateListingPropertyDescription(
    @Body() body: GetPropertyDescriptionDto,
  ): Promise<{
    choices: ChatCompletionResponseMessage[];
    realtyMoleData: RealtyMoleData;
  }> {
    const address = body.address;
    const keyInfo = body.keyInfo;
    const agentProfile = body.agentProfile;
    const data = await this.listingsService.getPropertyDescription({
      address,
      keyInfo,
      agentProfile,
    });

    return data;
  }

  @UseGuards(AtGuard)
  @Post('/create')
  async createListing(
    @Body() createListingDto: CreateListingDto,
  ): Promise<Listing> {
    return await this.listingsService.createListing(createListingDto);
  }

  @UseGuards(AtGuard)
  @Get(':id')
  async getListing(@Param() params: { id: string }): Promise<Listing> {
    return await this.listingsService.findOne('id', params.id);
  }
}
