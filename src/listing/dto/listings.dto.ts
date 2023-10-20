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
  @IsNumber()
  pricePerFoot: number;

  @IsNotEmpty()
  @IsString()
  associationFees: string;

  @IsNotEmpty()
  @IsString()
  imgSrc: string;

  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @IsNotEmpty()
  @IsString()
  squareFt: string;

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
  @IsJSON()
  nearbyPoi: JSON;

  @IsNotEmpty()
  @IsNumber()
  propertyInsightAvgFt: number;

  @IsNotEmpty()
  @IsNumber()
  propertyInsightAvgPrice: string;

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

  @IsNumber()
  garageCount: number;

  @IsString()
  subdivision: string;

  @IsString()
  county: string;

  @IsJSON()
  taxHistory: JSON;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
