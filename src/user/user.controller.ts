import {
  Controller,
  Get,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Patch,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/auth.jwt-auth.guard';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<User> {
    return await this.userService.findOne('email', req.user.email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Patch('/update')
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(updateUserDto);
  }
}
