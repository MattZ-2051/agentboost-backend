import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(key: string, val: string | number): Promise<User> {
    return this.userRepo.findOne({
      where: { [key]: val },
      relations: ['listings', 'buyers', 'campaigns'],
    });
  }

  getUsers(): string {
    return 'return all users!';
  }

  async updatePassword({
    email,
    newPassword,
  }: UpdateUserPasswordDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepo.update(
      { email },
      { password: newPassword },
    );

    if (user.affected === 1) {
      const newUser = await this.userRepo.findOneBy({ email });
      try {
        await queryRunner.manager.save(newUser);
        await queryRunner.commitTransaction();
        return;
      } catch (err) {
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
    } else {
      throw new HttpException('Error resetting password', 500);
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<User> {
    const { id } = dto;
    const userExists = await this.userRepo.findOneBy({ id });
    if (!userExists) {
      throw new HttpException('User does not exist', 400);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const user = await this.userRepo.update({ id }, { ...dto });

    if (user.affected === 1) {
      const newUser = await this.userRepo.findOneBy({ id });
      try {
        await queryRunner.manager.save(newUser);
        await queryRunner.commitTransaction();
        return newUser;
      } catch (err) {
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
    } else {
      throw new HttpException('Error updating user', 500);
    }
  }

  async createGoogleUser({
    email,
    password,
    fullName,
    profileImg,
  }: CreateUserDto): Promise<User | void> {
    const userExists = await this.userRepo.findOneBy({ email });
    if (userExists) {
      return userExists;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepo.create({
      email,
      password,
      fullName,
      profileImg,
    });

    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
  async createUser({
    email,
    password,
    fullName,
    profileImg,
  }: CreateUserDto): Promise<User | void> {
    const userExists = await this.userRepo.findOneBy({ email });
    if (userExists) {
      throw new HttpException('Email already exists.', 409);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepo.create({
      email,
      password,
      fullName,
      profileImg,
    });

    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  /**
   *
   * @param userId - id of user in db
   * @param hash - new refresh token hash to update user with
   * @returns void
   */
  async updateRtHash(userId: number, hash: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepo.update({ id: userId }, { rtHash: hash });
    if (user.affected === 1) {
      const updatedUser = await this.userRepo.findOneBy({ id: userId });
      try {
        await queryRunner.manager.save(updatedUser);
        await queryRunner.commitTransaction();
      } catch (err) {
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
    } else {
      throw new HttpException('Error logging user out', 500);
    }
  }
}
