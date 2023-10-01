import { Module } from '@nestjs/common';
import { ListingsService } from './listing.service';
import { ListingsController } from './listing.controller';
import { Listing } from './listings.entity';
import { RealtyModule } from '../realty/realty.module';
import { GptModule } from '../gpt/gpt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ZillowModule } from 'src/zillow/zillow.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    RealtyModule,
    UserModule,
    GptModule,
    ZillowModule,
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
