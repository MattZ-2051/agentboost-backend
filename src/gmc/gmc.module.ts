import { Module } from '@nestjs/common';
import { GmcController } from './gmc.controller';
import { GmcService } from './gmc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gmc } from './gmc.entity';
import { ListingsModule } from '../listing/listing.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gmc]), ListingsModule, GeminiModule],
  controllers: [GmcController],
  providers: [GmcService],
  exports: [GmcService],
})
export class GmcModule {}
