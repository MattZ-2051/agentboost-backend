import { Exclude } from 'class-transformer';

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
  email?: string;
  brandDescription?: string;
  areaOfExpertise?: string;
}
