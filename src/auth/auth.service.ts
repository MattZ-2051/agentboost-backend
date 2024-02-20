import * as argon from 'argon2';
import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, JwtPayload, Tokens, GoogleUser } from './types/auth.types';
import { CreateUserDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne('email', email);
    if (user && (await argon.verify(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async logout(userId: number): Promise<void> {
    return await this.usersService.updateRtHash(userId, '');
  }

  async login(user: User): Promise<Tokens> {
    console.log('here');
    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRtHash(user.id, tokens.refresh);
    return tokens;
  }

  async signup(dto: CreateUserDto): Promise<Tokens> {
    let user;
    if (dto.password.length) {
      const passwordHash = await argon.hash(dto.password);
      user = await this.usersService.createUser({
        email: dto.email,
        password: passwordHash,
        fullName: dto.fullName,
      });
    } else {
      user = await this.usersService.createUserFromGoogle({
        email: dto.email,
        fullName: dto.fullName,
        profileImg: dto.profileImg,
        password: '',
      });
    }

    if (user) {
      const tokens = await this.getTokens(user.id, user.email);
      await this.usersService.updateRtHash(user.id, tokens.refresh);
      return tokens;
    }
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access: at,
      refresh: rt,
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.findOne('id', userId);
    if (!user || !user.rtHash) throw new HttpException('Access Denied', 401);

    const rtMatches = await argon.verify(user.rtHash, rt);
    if (!rtMatches) throw new HttpException('Access Denied', 401);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh);

    return tokens;
  }

  public async googleRedirect(
    req: Request,
    res: Response,
  ): Promise<{ url: string }> {
    if (!req.user) {
      throw new UnauthorizedException('user not found');
    }

    //TODO: fix login so its more secure

    const { user } = req;

    const goolgeUser = user as GoogleUser;
    await this.googleLogin(goolgeUser);
    return {
      url: `http://localhost:3000/google-oauth-success-redirect${req.url}&user-email=${goolgeUser.email}`,
    };
  }

  private async googleLogin(user: GoogleUser): Promise<Tokens> {
    const googleUser = await this.signup({
      email: user.email,
      fullName: user.fullName,
      password: '',
      profileImg: user.picture,
    });
    return googleUser;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.usersService.updateRtHash(userId, hash);
  }
}
