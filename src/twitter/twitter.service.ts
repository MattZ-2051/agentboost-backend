import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client from 'twitter-api-sdk';

@Injectable()
export class TwitterService {
  constructor(private readonly configService: ConfigService) {
    const bearerToken = configService.get('TWITTER_BEARER_TOKEN');
    this.twitterClient = new Client(bearerToken);
  }

  private twitterClient: Client;

  // const getTweets = () => {

  // };
}
