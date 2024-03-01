import { IsNotEmpty, IsString } from 'class-validator';
import { File } from '../types';

export class UploadGoogleFileDto {
  @IsNotEmpty()
  file: File;

  @IsNotEmpty()
  @IsString()
  filePath: string;
}
