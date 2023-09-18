import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RealtyMoleData } from 'src/realty/types/realty.types';

export class GeneratePropertyDescriptionDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  keyInfo: string;

  @IsNotEmpty()
  @IsJSON()
  realtyMoleData: RealtyMoleData;
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
