import * as argon from 'argon2';
import { Injectable, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, JwtPayload, Tokens } from './types/auth.types';
import { CreateUserDto } from './dto/auth.dto';

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
    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRtHash(user.id, tokens.refresh);
    return tokens;
  }

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const passwordHash = await argon.hash(dto.password);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: passwordHash,
      fullName: dto.fullName,
    });

    console.log('user', user);
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

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.usersService.updateRtHash(userId, hash);
  }
}
