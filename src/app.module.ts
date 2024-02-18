import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodoListsModule } from './todo-lists/todo-lists.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        conf: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: await conf.get('POSTGRES_HOST'),
          port: +(await conf.get('POSTGRES_PORT')),
          username: await conf.get('POSTGRES_USER'),
          password: await conf.get('POSTGRES_PASSWORD'),
          database: await conf.get('POSTGRES_DATABASE'),
          entities: ['**/*.entity.js'],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    TodoListsModule,
    AuthModule,
    ApiGatewayModule,
  ],
})
export class AppModule {}
