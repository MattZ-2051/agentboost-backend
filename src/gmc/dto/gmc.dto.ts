import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGmcDto {
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

  @IsNumber()
  @IsNotEmpty()
  listingId;

  @IsString()
  @IsNotEmpty()
  location;
}
