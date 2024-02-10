import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './dto/auth.dto';
import { Tokens } from './types/auth.types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RtGuard } from './guards/auth.jwt-rt.guard';
import { AtGuard } from './guards/auth.jwt-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<Tokens> {
    return await this.authService.login(req.user);
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Public()
  @UseGuards(AtGuard)
  @Post('logout')
  async logout(@Request() req): Promise<void> {
    const id = req.body.userId;
    return await this.authService.logout(id);
  }

  @Public()
  @UseGuards(AtGuard)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    return await this.authService.signup(createUserDto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(): Promise<Tokens> {
    const userId = 1;
    const refreshToken = '';
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
