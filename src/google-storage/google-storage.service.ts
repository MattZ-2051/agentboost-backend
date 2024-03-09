import { HttpException, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadGoogleFileDto } from './dto/google-storage.dto';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';
import { Bucket, Storage } from '@google-cloud/storage';
import { parse } from 'path';
import { File } from './types';

@Injectable()
export class GoogleStorageService {
  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: 'src/google-storage/key.json',
    });
    this.bucket = this.storage.bucket('agentboost-dev');
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
