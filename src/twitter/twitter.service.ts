import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, auth } from 'twitter-api-sdk';
import { LoginTwitterDto } from './dto/twitter.dto';

@Injectable()
export class TwitterService {
  constructor(private readonly configService: ConfigService) {
    const bearerToken = configService.get('TWITTER_BEARER_TOKEN');
    const clientId = configService.get('TWITTER_CLIENT_ID');
    const clientSecret = configService.get('TWITTER_CLIENT_SECRET');

    this.twitterClient = new auth.OAuth2User({
      client_id: clientId,
      client_secret: clientSecret,
      callback: 'http://localhost:5001/twitter/callback',
      scopes: ['tweet.read', 'users.read', 'offline.access'],
    });
    // this.twitterClient = new Client(authClient);
  }
  private twitterClient: auth.OAuth2User;

  async login(req, res): Promise<{ url: string }> {
    const authUrl = this.twitterClient.generateAuthURL({
      state: 'my-state',
      code_challenge_method: 's256',
    });

    console.log('auth url', authUrl);
    return { url: authUrl };
  }

  async callback(req, res): Promise<void> {
    const { code } = req.query;
    try {
      await this.twitterClient.requestAccessToken(code as string);
      return;
    } catch (error) {
      console.log('Twitter error', error);
    }
  }
}
