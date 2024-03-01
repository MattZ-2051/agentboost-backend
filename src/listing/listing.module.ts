import { Module } from '@nestjs/common';
import { ListingsService } from './listing.service';
import { ListingsController } from './listing.controller';
import { Listing } from './listing.entity';
import { RealtyModule } from '../realty/realty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ZillowModule } from 'src/zillow/zillow.module';
import { MapsModule } from 'src/maps/maps.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    RealtyModule,
    UserModule,
    ZillowModule,
    MapsModule,
    GeminiModule,
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
