import { IsNotEmpty, IsString } from 'class-validator';

export class GetNearbyPOIs {
  @IsNotEmpty()
  @IsString()
  latitude;

  @IsNotEmpty()
  @IsString()
  longitude;
}
