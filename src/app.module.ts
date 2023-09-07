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
import { ListingsModule } from './listings/listings.module';
import { GmcModule } from './gmc/gmc.module';
import { ZillowService } from './zillow/zillow.service';
import { ZillowController } from './zillow/zillow.controller';
import { ZillowModule } from './zillow/zillow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
  ],
  providers: [AppService, ZillowService],
  controllers: [AppController, ZillowController],
})
export class AppModule {}
