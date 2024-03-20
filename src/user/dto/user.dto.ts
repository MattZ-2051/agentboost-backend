import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  id: number;

  @IsString()
  email: string;

  @IsString()
  brandDescription: string;

  @IsString()
  areaOfExpertise: string;

  @IsString()
  instagramId: string;

  @IsString()
  facebookId: string;

  @IsString()
  xId: string;

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
