import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  messages: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsString()
  targetAudience: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
