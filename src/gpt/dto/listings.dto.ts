import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
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

  @IsNotEmpty()
  @IsString()
  agentProfile: string;
}
