import { IsNotEmpty, IsString } from 'class-validator';
import { File } from '../types';

export class GetNearbyPoiDto {
  @IsNotEmpty()
  @IsString()
  latitude;

  @IsNotEmpty()
  @IsString()
  longitude;
}

export class UploadGoogleFileDto {
  @IsNotEmpty()
  file: File;

  @IsNotEmpty()
  @IsString()
  filePath: string;
}
