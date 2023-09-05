import { Module } from '@nestjs/common';
import { GmcController } from './gmc.controller';
import { GmcService } from './gmc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gmc } from './gmc.entity';
import { ListingsModule } from '../listings/listings.module';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gmc]), ListingsModule, GptModule],
  controllers: [GmcController],
  providers: [GmcService],
  exports: [GmcService],
})
export class GmcModule {}
