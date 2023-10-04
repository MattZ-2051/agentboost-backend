import { IsNumber, IsNotEmpty, IsString, IsJSON } from 'class-validator';

export class GetPropertyDescriptionDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  keyInfo: string;
}

export class CreateCmaDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  radius: number;

  @IsString()
  status: 'Active' | 'Inactive';
}

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  propertyDescription: string;

  @IsNotEmpty()
  @IsNumber()
  zpid: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsNumber()
  bedrooms: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  neighberhood: string;

  @IsString()
  county: string;

  @IsNotEmpty()
  @IsNumber()
  bathrooms: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
