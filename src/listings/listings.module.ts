import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from './listings.entity';
import { RealtyModule } from 'src/realty/realty.module';
import { GptModule } from 'src/gpt/gpt.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Listing]), RealtyModule, GptModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
