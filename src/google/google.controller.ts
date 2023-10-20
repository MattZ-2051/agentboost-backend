import { Body, Controller, Post } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  // @Public()
  // @Post('test')
  // async testPlaces(@Body() body: any): Promise<any> {
  //   return await this.googleService.getNearbyPointsOfInterest({
  //     latitude: 47.63394,
  //     longitude: -122.34212,
  //   });
  // }
}
