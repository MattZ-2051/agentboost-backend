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
   * function that handles getting property info from zillow api
   * @param dto - dto object containing address to be sent to zillow api
   * @returns the response from https://rapidapi.com/apimaker/api/zillow-com1 /property endpoint
   */
  async getPropertyInfo(dto: GetPropertyInfoDto): Promise<ZillowPropertyInfo> {
    const apiKey = this.configService.get<string>('ZILLOW_API_KEY');
    const apiUrl = this.configService.get<string>('ZILLOW_API_HOST');

    try {
      const response = await this.httpService.axiosRef.get<any>(
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
      return response.data;
    } catch (error) {
      console.log('zillow error:', error);
      throw new HttpException('zillow error', 500);
    }
  }
}
