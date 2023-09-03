import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPropertyListingDataDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class GetPropertyCmaDataDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  radius: number;

  @IsString()
  status: 'Active' | 'Inactive';
}
