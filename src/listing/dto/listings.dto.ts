import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

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
  zpid: string;
}

export class CreateListingDto {
  @IsNotEmpty()
  @IsNumber()
  zpid: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  imgSrc: string;

  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @IsNotEmpty()
  @IsNumber()
  squareFt: number;

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
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  zillowDescription: string;

  @IsNotEmpty()
  @IsString()
  propertyDescription: string;

  @IsNotEmpty()
  @IsString()
  lotSize: string;

  @IsNotEmpty()
  @IsNumber()
  bedrooms: number;

  @IsNotEmpty()
  @IsNumber()
  bathrooms: number;

  @IsNotEmpty()
  @IsNumber()
  yearBuilt: number;

  @IsNotEmpty()
  @IsNumber()
  propertyInsightAvgFt: number;

  @IsNotEmpty()
  @IsNumber()
  propertyInsightAvgPrice: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  subdivision: string;

  @IsString()
  county: string;

  @IsString()
  neighberhood: string;
}
