import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthModule } from '../auth/auth.module';
import { TodoListsModule } from '../todo-lists/todo-lists.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (conf: ConfigService) => {
        return {
          global: true,
          secret: await conf.get('JWT_SECRET'),
          signOptions: { expiresIn: `${await conf.get('JWT_LIFE_SECONDS')}s` },
        };
      },
    }),
    UsersModule,
    AuthModule,
    TodoListsModule,
  ],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
