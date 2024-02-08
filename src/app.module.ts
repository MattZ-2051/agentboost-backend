import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { GptModule } from './gpt/gpt.module';
import { ListingsModule } from './listing/listing.module';
import { GmcModule } from './gmc/gmc.module';
import { ZillowService } from './zillow/zillow.service';
import { ZillowController } from './zillow/zillow.controller';
import { ZillowModule } from './zillow/zillow.module';
import { BuyerController } from './buyer/buyer.controller';
import { BuyerService } from './buyer/buyer.service';
import { BuyerModule } from './buyer/buyer.module';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { GoogleModule } from './google/google.module';
import { FacebookService } from './facebook/facebook.service';
import { FacebookModule } from './facebook/facebook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
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
    GptModule,
    HttpModule,
    GmcModule,
    ListingsModule,
    ZillowModule,
    BuyerModule,
    GoogleModule,
    FacebookModule,
  ],
  providers: [
    AppService,
    ZillowService,
    BuyerService,
    GoogleService,
    FacebookService,
  ],
  controllers: [
    AppController,
    ZillowController,
    BuyerController,
    GoogleController,
  ],
})
export class AppModule {}
