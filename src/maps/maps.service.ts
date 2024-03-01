import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';
import { GetNearbyPoiDto } from './dto/maps.dto';
import { HttpException } from '@nestjs/common';
@Injectable()
export class MapsService {
  constructor(private readonly configService: ConfigService) {}

  async getNearbyPointsOfInterest(dto: GetNearbyPoiDto): Promise<any> {
    const client = new Client();

    console.log('dto', dto);
    const apiKey = this.configService.get('GOOGLE_API_KEY');
    try {
      const response = await client.placesNearby({
        params: {
          location: { lat: dto.latitude, lng: dto.longitude },
          key: apiKey,
          radius: 5000,
        },
      });
      return response.data.results;
    } catch (err) {
      console.log('error', err);
      throw new HttpException('google places api error', 500);
    }
  }
}
