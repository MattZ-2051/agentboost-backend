import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Redirect,
  Response,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto, ResetPasswordDto } from './dto/auth.dto';
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

  @Public()
  @UseGuards(AtGuard)
  @Patch('password/reset')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return await this.authService.resetPassword(dto);
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google-login')
  async googleAuth(@Request() req) {
    return { msg: 'Google Authentication' };
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google-redirect')
  @Redirect()
  async googleAuthRedirect(@Request() req, @Response() res) {
    return await this.authService.googleRedirect(req, res);
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
