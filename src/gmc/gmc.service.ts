import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GmcService {
  constructor(private readonly configService: ConfigService) {}
}
