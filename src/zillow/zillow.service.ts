import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GetPropertyImagesDto } from './dto/zillow.dto';

@Injectable()
export class ZillowService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getPropertyImages(dto: GetPropertyImagesDto): Promise<string[]> {
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
      const imgSrc = response.data?.imgSrc;
      if (imgSrc) {
        return [imgSrc];
      } else {
        return [];
      }
    } catch (error) {
      console.log('zillow error:', error);
      throw new HttpException('zillow error', 500);
    }
  }
}
