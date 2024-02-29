import { HttpException, Injectable, BadRequestException } from '@nestjs/common';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import { GetNearbyPoiDto, UploadGoogleFileDto } from './dto/google.dto';
import { Bucket, Storage } from '@google-cloud/storage';
import { parse } from 'path';
import { File } from './types';

@Injectable()
export class GoogleService {
  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: 'src/google/storage/key.json',
    });
    this.bucket = this.storage.bucket('agentboost-dev');
  }

  async getNearbyPointsOfInterest(dto: GetNearbyPoiDto): Promise<any> {
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
      throw new HttpException('google places api error', 500);
    }
  }

  private bucket: Bucket;
  private storage: Storage;

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(uploadedFile: File, destination: string): Promise<any> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile?.buffer, {
        contentType: uploadedFile?.mimetype,
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
    return {
      ...file.metadata,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
  async uploadToBucket(
    { filePath }: UploadGoogleFileDto,
    file: File,
  ): Promise<{ data: string }> {
    try {
      const response = await this.uploadFile(file, filePath);
      return { data: response.mediaLink };
    } catch (err) {
      console.log('error', err);
      throw new HttpException('google storage upload error', 500);
    }
  }
}
