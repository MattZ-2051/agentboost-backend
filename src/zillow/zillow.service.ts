import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GetPropertyInfoDto } from './dto/zillow.dto';
import { ZillowPropertyInfo } from './types/zillow.types';

@Injectable()
export class ZillowService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * function that handles getting property info from zillow api for listings
   * @param dto - dto object containing address to be sent to zillow api
   * @returns the response from https://rapidapi.com/apimaker/api/zillow-com1 /property endpoint
   */
  async getPropertyInfo(dto: GetPropertyInfoDto): Promise<ZillowPropertyInfo> {
    const apiKey = this.configService.get<string>('ZILLOW_API_KEY');
    const apiUrl = this.configService.get<string>('ZILLOW_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<ZillowPropertyInfo>(
        `${apiUrl}/property`,
        {
          params: {
            address: dto.address,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          },
        },
      );

      const { data } = response;
      const zillowInfo: ZillowPropertyInfo = {
        zpid: data.zpid,
        imgSrc: data.imgSrc,
        zestimate: data.zestimate,
        address: {
          city: data.address.city,
          state: data.address.state,
          neighberhood: data.address.neighberhood,
          streetAddress: data.address.streetAddress,
          zipcode: data.address.zipcode,
        },
        county: data.county,
        description: data.description,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        resoFacts: {
          lotSize: data.resoFacts.lotSize,
          livingArea: data.resoFacts.livingArea,
        },
      };
      return zillowInfo;
    } catch (error) {
      console.log('zillow error:', error);
      throw new HttpException('zillow error', 500);
    }
  }

  /**
   * function handling property comparable properties for listings from /propertyComps endpoint
   * @param zpid - zpid given to property by zillow, should be retrieved previously from getPropertyInfo
   * @returns - array of comparable properties returned from zillow
   */

  async getPropertyComps(zpid: string): Promise<any[]> {
    const apiKey = this.configService.get<string>('ZILLOW_API_KEY');
    const apiUrl = this.configService.get<string>('ZILLOW_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<{ comps: any[] }>(
        `${apiUrl}/propertyComps`,
        {
          params: {
            zpid,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          },
        },
      );

      return response.data.comps;
    } catch (error) {
      console.log('zillow error:', error);
      throw new HttpException('zillow error', 500);
    }
  }

  /**
   * function that handles getting similar properties that were recently sold from zillow /similarSales endpoint
   * @param zpid - zpid given to property by zillow, should be retrieved previously from getPropertyInfo
   * @returns array of similar properties recently sold
   */

  async getRecentlySold(zpid: string): Promise<any[]> {
    const apiKey = this.configService.get<string>('ZILLOW_API_KEY');
    const apiUrl = this.configService.get<string>('ZILLOW_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<any[]>(
        `${apiUrl}/similarSales`,
        {
          params: {
            zpid,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('zillow error:', error);
      throw new HttpException('zillow error', 500);
    }
  }
}
