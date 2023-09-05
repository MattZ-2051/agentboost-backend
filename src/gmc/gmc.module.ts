import { Module } from '@nestjs/common';
import { GmcController } from './gmc.controller';
import { GmcService } from './gmc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gmc } from './gmc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gmc])],
  controllers: [GmcController],
  providers: [GmcService],
  exports: [GmcService],
})
export class GmcModule {}
