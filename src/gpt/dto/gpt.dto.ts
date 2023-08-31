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
  @IsString()
  @IsNotEmpty()
  subdivision: string;

  @IsNotEmpty()
  @IsString()
  avgDays: string;

  @IsNotEmpty()
  @IsString()
  pricePerFoot: string;

  @IsNotEmpty()
  @IsString()
  soldPrice: string;

  @IsNotEmpty()
  @IsNumber()
  lotSize: string;

  @IsNotEmpty()
  @IsNumber()
  avgLotSize: string;

  @IsNotEmpty()
  @IsString()
  appreciationAvg: string;
}
