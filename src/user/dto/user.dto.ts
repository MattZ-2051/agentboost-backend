import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  id: number;
  email: string;
  brandDescription: string;
  areaOfExpertise: string;
  instagram: boolean;
  facebook: boolean;
  x: boolean;
  @Exclude()
  password;
  rtHash;
}

export class UpdateUserDto {
  id: number;

  @IsString()
  brandDescription?: string;

  @IsString()
  profileImg?: string;

  businessLogo?: string;

  @IsString()
  fullName?: string;

  @IsString()
  phoneNumber?: string;

  @IsString()
  brokerage?: string;
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
