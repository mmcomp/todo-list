import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useFactory: () => ({
            signAsync: jest.fn(),
          }),
        },
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn(),
            findOneByEmailOrThrow: jest.fn(),
          }),
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register the user', async () => {
      const createUserDto = {
        name: 'Mehrdad',
        email: 'm.mirsamie@gmail.com',
        password: '123456',
      } as CreateUserDto;
      const user = { ...createUserDto, id: 'user-id' } as User;
      jest.spyOn(usersService, 'create').mockImplementation(async (dto) => {
        user.password = dto.password;
        return user;
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const { access_token: token } = await service.registerUser(createUserDto);

      expect(token).toStrictEqual('token');
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should not register the user because it email exists', async () => {
      const createUserDto = {
        name: 'Mehrdad',
        email: 'm.mirsamie@gmail.com',
        password: '123456',
      } as CreateUserDto;
      jest.spyOn(usersService, 'create').mockImplementation(() => {
        const de = { message: 'duplicate key value', name: '' };
        const e = new QueryFailedError('', [], de);
        throw e;
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      expect(async () => {
        await service.registerUser(createUserDto);
      }).rejects.toThrow(BadRequestException);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(0);
    });
  });

  describe('loginUser', () => {
    it('should login the user', async () => {
      const loginUserDto = {
        email: 'm.mirsamie@gmail.com',
        password: '123456',
      } as LoginUserDto;
      const user = {
        id: 'user-id',
        name: 'Mehrdad',
        email: 'm.mirsamie@gmail.com',
        password: 'hashed-pass',
      } as User;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(usersService, 'findOneByEmailOrThrow').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const { access_token: token } = await service.loginUser(loginUserDto);

      expect(token).toStrictEqual('token');
      expect(usersService.findOneByEmailOrThrow).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should not login the user because incorrect password', async () => {
      const loginUserDto = {
        email: 'm.mirsamie@gmail.com',
        password: '123456',
      } as LoginUserDto;
      const user = {
        id: 'user-id',
        name: 'Mehrdad',
        email: 'm.mirsamie@gmail.com',
        password: 'hashed-pass',
      } as User;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest.spyOn(usersService, 'findOneByEmailOrThrow').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      expect(async () => {
        await service.loginUser(loginUserDto);
      }).rejects.toThrow(ForbiddenException);

      expect(usersService.findOneByEmailOrThrow).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(0);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should not login the user because email not found', async () => {
      const loginUserDto = {
        email: 'm.mirsamie@gmail.com',
        password: '123456',
      } as LoginUserDto;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest
        .spyOn(usersService, 'findOneByEmailOrThrow')
        .mockImplementation(() => {
          const e = new EntityNotFoundError(User, null);
          throw e;
        });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      expect(async () => {
        await service.loginUser(loginUserDto);
      }).rejects.toThrow(NotFoundException);

      expect(usersService.findOneByEmailOrThrow).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(0);
    });
  });
});
