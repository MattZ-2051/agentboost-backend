import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto } from './dto/user.dto';

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
      relations: ['listings'],
    });
  }

  getUsers(): string {
    return 'return all users!';
  }

  async updateUser({
    email,
    areaOfExpertise,
    brandDescription,
  }: UpdateUserDto) {
    const userExists = await this.userRepo.findOneBy({ email });
    if (!userExists) {
      throw new HttpException('User does not exist', 400);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const user = await this.userRepo.update(
      { email },
      { email, areaOfExpertise, brandDescription },
    );
    if (user.affected === 1) {
      const updatedUser = await this.userRepo.findOneBy({ email });
      try {
        await queryRunner.manager.save(updatedUser);
        await queryRunner.commitTransaction();
        return updatedUser;
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

  async createUser({ email, password }: CreateUserDto): Promise<User | void> {
    const userExists = await this.userRepo.findOneBy({ email });
    if (userExists) {
      throw new HttpException('Username already exists.', 409);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepo.create({
      email,
      password,
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
