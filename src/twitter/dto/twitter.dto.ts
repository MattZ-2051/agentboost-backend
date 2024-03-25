import { IsNotEmpty, IsString } from 'class-validator';

export class LoginTwitterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
