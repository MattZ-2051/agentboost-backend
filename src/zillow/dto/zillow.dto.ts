import { IsNotEmpty, IsString } from 'class-validator';

export class GetPropertyInfoDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
