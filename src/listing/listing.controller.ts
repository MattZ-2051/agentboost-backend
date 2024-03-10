import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ListingsService } from './listing.service';
import { AtGuard } from '../auth/guards/auth.jwt-auth.guard';
import { CreateCmaDto, GetPropertyDescriptionDto } from './dto/listings.dto';
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
    text: string;
    zillowInfo: ZillowPropertyInfo;
  }> {
    const { address, keyInfo, city, state } = body;
    const data = await this.listingsService.getPropertyDescription({
      address,
      keyInfo,
      city,
      state,
    });

    return data;
  }

  @UseGuards(AtGuard)
  @Delete('/delete/:id')
  async deleteListing(@Param() params: { id: string }): Promise<any> {
    return await this.listingsService.deleteListing(params.id);
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
    return await this.listingsService.findOne('id', params.id, ['gmcs']);
  }
}
