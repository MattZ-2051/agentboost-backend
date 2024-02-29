import { Controller, Get, UseGuards, Post, Body, Param } from '@nestjs/common';
import { ListingsService } from './listing.service';
import { AtGuard } from '../auth/guards/auth.jwt-auth.guard';
import { CreateCmaDto, GetPropertyDescriptionDto } from './dto/listings.dto';
import type { ChatCompletionResponseMessage } from 'openai';
import { CreateListingDto } from './dto/listings.dto';
import { Listing } from './listing.entity';
import { ZillowPropertyInfo } from 'src/zillow/types/zillow.types';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(AtGuard)
  @Post('/create/property-description')
  async generateListingPropertyDescription(
    @Body() body: GetPropertyDescriptionDto,
  ): Promise<{
    choices: ChatCompletionResponseMessage[];
    zillowInfo: ZillowPropertyInfo;
  }> {
    const address = body.address;
    const keyInfo = body.keyInfo;
    const data = await this.listingsService.getPropertyDescription({
      address,
      keyInfo,
    });

    return data;
  }

  @UseGuards(AtGuard)
  @Post('/generate-cma/:id')
  async createCma(
    @Param() params: { id: string },
    @Body() createCmaDto: CreateCmaDto,
  ): Promise<Listing> {
    return await this.listingsService.createCma(
      {
        ...createCmaDto,
      },
      params.id,
    );
  }

  // @UseGuards(AtGuard)
  @Post('/create')
  async createListing(
    @Body() createListingDto: CreateListingDto,
  ): Promise<Listing> {
    return await this.listingsService.createListing(createListingDto);
  }

  @UseGuards(AtGuard)
  @Get(':id')
  async getListing(@Param() params: { id: string }): Promise<Listing> {
    return await this.listingsService.findOne('id', params.id, ['gmcs']);
  }
}
