import { Module } from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { TodoItem } from './entities/todo-item.entity';
import { TodoList } from './entities/todo-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TodoItemsService } from './todo-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoItem, TodoList]),
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
  ],
  providers: [TodoListsService, TodoItemsService],
  exports: [TodoListsService, TodoItemsService],
})
export class TodoListsModule {}
