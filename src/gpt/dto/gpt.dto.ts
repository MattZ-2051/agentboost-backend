import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ZillowPropertyInfo } from 'src/zillow/types/zillow.types';

export class GeneratePropertyDescriptionDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  keyInfo: string;

  @IsNotEmpty()
  @IsJSON()
  zillowInfo: ZillowPropertyInfo;
}

export class GeneratePropertyInsightDto {
  @IsNotEmpty()
  @IsNumber()
  squareFt: number;

  @IsNotEmpty()
  @IsString()
  bedrooms: number;

  @IsString()
  subdivision: string;

  @IsNotEmpty()
  @IsNumber()
  radius: number;

  @IsNotEmpty()
  @IsNumber()
  lotSize: number;

  @IsNotEmpty()
  pool: any[];
}

export class GenerateListingGmcDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  bed;

  @IsNumber()
  @IsNotEmpty()
  bath;

  @IsNumber()
  @IsNotEmpty()
  squareFt;

  @IsString()
  @IsNotEmpty()
  propertyDescription;

  @IsString()
  @IsNotEmpty()
  location;
}
