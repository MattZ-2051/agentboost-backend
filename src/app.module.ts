import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listing/listing.module';
import { GmcModule } from './gmc/gmc.module';
import { ZillowService } from './zillow/zillow.service';
import { ZillowController } from './zillow/zillow.controller';
import { ZillowModule } from './zillow/zillow.module';
import { BuyerController } from './buyer/buyer.controller';
import { BuyerService } from './buyer/buyer.service';
import { BuyerModule } from './buyer/buyer.module';
import { FacebookService } from './facebook/facebook.service';
import { FacebookModule } from './facebook/facebook.module';
import { CampaignModule } from './campaign/campaign.module';
import { GoogleStorageModule } from './google-storage/google-storage.module';
import { GeminiModule } from './gemini/gemini.module';
import { MapsModule } from './maps/maps.module';
import { TwitterController } from './twitter/twitter.controller';
import { TwitterService } from './twitter/twitter.service';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PassportModule,
    HttpModule,
    GmcModule,
    ListingsModule,
    ZillowModule,
    BuyerModule,
    FacebookModule,
    CampaignModule,
    GoogleStorageModule,
    GeminiModule,
    MapsModule,
    TwitterModule,
  ],
  providers: [AppService, ZillowService, BuyerService, FacebookService, TwitterService],
  controllers: [AppController, ZillowController, BuyerController, TwitterController],
})
export class AppModule {}
