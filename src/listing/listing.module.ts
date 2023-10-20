import { Module } from '@nestjs/common';
import { ListingsService } from './listing.service';
import { ListingsController } from './listing.controller';
import { Listing } from './listing.entity';
import { RealtyModule } from '../realty/realty.module';
import { GptModule } from '../gpt/gpt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ZillowModule } from 'src/zillow/zillow.module';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    RealtyModule,
    UserModule,
    GptModule,
    ZillowModule,
    GoogleModule,
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
