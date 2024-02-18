import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async checkPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result ? true : false;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<{ access_token }> {
    const hashedPassword = await this.generatePasswordHash(
      createUserDto.password,
    );
    try {
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const access_token = await this.jwtService.signAsync({
        sub: user.id,
      });

      return { access_token };
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.message.indexOf('duplicate key value') >= 0) {
          throw new BadRequestException('This email exists in our database');
        }
      }

      throw e;
    }
  }

  async loginUser({
    email,
    password,
  }: LoginUserDto): Promise<{ access_token }> {
    try {
      const user = await this.usersService.findOneByEmailOrThrow(email);
      if (!(await this.checkPassword(password, user.password))) {
        throw new ForbiddenException('Incorrect Password or Email');
      }

      const access_token = await this.jwtService.signAsync({
        sub: user.id,
      });

      return { access_token };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Email not found');
      }

      throw e;
    }
  }
}
