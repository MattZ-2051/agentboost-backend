import { IsNotEmpty, IsString } from 'class-validator';

export class GetPropertyInfoDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  city?: string;

  @IsString()
  state?: string;
}
