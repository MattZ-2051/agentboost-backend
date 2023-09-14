import { IsNotEmpty, IsString } from 'class-validator';

export class GetPropertyImagesDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
