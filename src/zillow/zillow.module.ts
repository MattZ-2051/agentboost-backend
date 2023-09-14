import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZillowController } from './zillow.controller';
import { ZillowService } from './zillow.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ZillowController],
  providers: [ZillowService],
  exports: [ZillowService],
})
export class ZillowModule {}
