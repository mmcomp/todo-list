import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = createUserDto as User;
    await this.repo.save(user);

    return user;
  }

  findOneByEmailOrThrow(email: string): Promise<User> {
    return this.repo.findOneByOrFail({ email });
  }

  findOneByIdOrThrow(id: string): Promise<User> {
    return this.repo.findOneByOrFail({ id });
  }
}
