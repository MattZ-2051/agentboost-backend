import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCalenderDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;
}

export class CreateGmcDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  brandingDescripton: string;

  @IsNumber()
  @IsNotEmpty()
  bed: number;

  @IsNumber()
  @IsNotEmpty()
  bath: number;

  @IsNumber()
  @IsNotEmpty()
  squareFt: number;

  @IsString()
  @IsNotEmpty()
  propertyDescription: string;

  @IsNumber()
  @IsNotEmpty()
  listingId: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
