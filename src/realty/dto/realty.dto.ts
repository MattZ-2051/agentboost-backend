import { IsNotEmpty, IsString } from 'class-validator';

export class GetPropertyListingDataDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
