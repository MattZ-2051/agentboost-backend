import { IsNotEmpty, IsString } from 'class-validator';

export class GetPropertyImagesDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class GetPropertyInfoDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
