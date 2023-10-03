import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  GetPropertyCmaDataDto,
  GetPropertyInsightDto,
  GetPropertyListingDataDto,
} from './dto/realty.dto';
import { RealtyMoleData } from './types/realty.types';
import { SaleListing } from 'src/listing/types/listings.types';

@Injectable()
export class RealtyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getPropertyCma(dto: GetPropertyCmaDataDto): Promise<SaleListing[]> {
    const apiKey = this.configService.get<string>('REALTY_MOLE_API_KEY');
    const apiUrl = this.configService.get<string>('REALTY_MOLE_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<SaleListing[]>(
        `${apiUrl}/saleListings`,
        {
          params: {
            ...dto,
            limit: 20,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new HttpException(`${error?.response?.data}`, 404);
      } else {
        throw new HttpException(
          `Realty Mole Error, ${error?.response?.data}`,
          500,
        );
      }
    }
  }

  async getPropertyInsightData({
    address,
    radius,
  }: GetPropertyInsightDto): Promise<any> {
    const apiKey = this.configService.get<string>('REALTY_MOLE_API_KEY');
    const apiUrl = this.configService.get<string>('REALTY_MOLE_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<SaleListing[]>(
        `${apiUrl}/saleListings`,
        {
          params: {
            address,
            radius,
            limit: 20,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new HttpException(`${error?.response?.data}`, 404);
      } else {
        throw new HttpException(
          `Realty Mole Error, ${error?.response?.data}`,
          500,
        );
      }
    }
  }
  async getPropertyListingData({
    address,
  }: GetPropertyListingDataDto): Promise<RealtyMoleData> {
    const apiKey = this.configService.get<string>('REALTY_MOLE_API_KEY');
    const apiUrl = this.configService.get<string>('REALTY_MOLE_API_HOST');
    try {
      const response = await this.httpService.axiosRef.get<any>(
        `${apiUrl}/properties`,
        {
          params: {
            address,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new HttpException(`${error?.response?.data}`, 404);
      } else {
        throw new HttpException(
          `Realty Mole Error, ${error?.response?.data}`,
          500,
        );
      }
    }
  }
}
