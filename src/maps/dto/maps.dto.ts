import { IsNotEmpty, IsString } from 'class-validator';
export class GetNearbyPoiDto {
  @IsNotEmpty()
  @IsString()
  latitude;

  @IsNotEmpty()
  @IsString()
  longitude;
}
