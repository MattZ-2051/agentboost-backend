import { IsNumber, IsNotEmpty, IsString, IsJSON } from 'class-validator';
import { User } from '../../user/user.entity';

export class GetPropertyDescriptionDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  keyInfo: string;

  @IsNotEmpty()
  @IsString()
  agentProfile: string;
}

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  propertyDescription: string;

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
  formattedAddress: string;

  @IsNotEmpty()
  @IsNumber()
  bedrooms: number;

  @IsString()
  county: string;

  @IsString()
  legalDescription: string;

  @IsNotEmpty()
  @IsNumber()
  squareFootage: number;

  @IsString()
  subdivision: string;

  @IsNotEmpty()
  @IsNumber()
  yearBuilt: number;

  @IsNotEmpty()
  @IsNumber()
  bathrooms: number;

  @IsNotEmpty()
  @IsNumber()
  lotSize: number;

  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @IsString()
  lastSaleDate: string;

  @IsNotEmpty()
  @IsJSON()
  features: JSON;

  @IsJSON()
  propertyTaxes: JSON;

  @IsJSON()
  owner: JSON;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
