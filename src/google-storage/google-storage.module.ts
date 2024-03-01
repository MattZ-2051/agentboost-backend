import { Module } from '@nestjs/common';
import { GoogleStorageService } from './google-storage.service';
import { GoogleStorageController } from './google-storage.controller';

@Module({
  providers: [GoogleStorageService],
  controllers: [GoogleStorageController],
})
export class GoogleStorageModule {}
