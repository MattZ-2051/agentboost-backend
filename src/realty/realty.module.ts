import { Module } from '@nestjs/common';
import { RealtyService } from './realty.service';
import { RealtyController } from './realty.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [RealtyController],
  providers: [RealtyService],
  exports: [RealtyService],
})
export class RealtyModule {}
