import {
  Request,
  Response,
  Body,
  Controller,
  Get,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { TwitterService } from './twitter.service';
import { LoginTwitterDto } from './dto/twitter.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('twitter')
export class TwitterController {
  constructor(
    private readonly configService: ConfigService,
    private readonly twitterService: TwitterService,
  ) {}

  @UseGuards(AtGuard)
  @Get('/login')
  @Redirect()
  async twitterLogin(@Request() req, @Response() res) {
    return this.twitterService.login(req, res);
  }

  @Public()
  @Get('/callback')
  @Redirect()
  async twitterCallback(@Request() req, @Response() res) {
    return this.twitterService.callback(req, res);
  }
}
