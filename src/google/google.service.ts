import { HttpException, Injectable } from '@nestjs/common';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import { GetNearbyPOIs } from './dto/google.dto';

@Injectable()
export class GoogleService {
  constructor(private readonly configService: ConfigService) {}

  async getNearbyPointsOfInterest(dto: GetNearbyPOIs): Promise<any> {
    const client = new Client();

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
