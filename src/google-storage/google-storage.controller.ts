import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleStorageService } from './google-storage.service';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('google-storage')
export class GoogleStorageController {
  constructor(private readonly storageService: GoogleStorageService) {}

  // @Public()
  // @Post('test')
  // async testPlaces(@Body() body: any): Promise<any> {
  //   return await this.googleService.getNearbyPointsOfInterest({
  //     latitude: 47.63394,
  //     longitude: -122.34212,
  //   });
  // }

  @UseGuards(AtGuard)
  @Post('/bucket/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToBucket(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto,
  ): Promise<{ data: string }> {
    return await this.storageService.uploadToBucket(dto, file);
  }
}
