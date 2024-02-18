import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { User } from '../users/entities/user.entity';
import { TodoList } from './entities/todo-list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList) private readonly listRepo: Repository<TodoList>,
  ) {}

  async create(
    createTodoListDto: CreateTodoListDto,
    user: User,
  ): Promise<TodoList> {
    const list = createTodoListDto as TodoList;
    list.userId = user.id;

    await this.listRepo.save(list);

    return list;
  }

  findAll(user: User): Promise<TodoList[]> {
    return this.listRepo.find({
      where: { userId: user.id },
      order: { lastItemUpdatedAt: -1 },
    });
  }

  async update(
    id: string,
    updateTodoListDto: UpdateTodoListDto,
    user: User,
  ): Promise<TodoList> {
    const list = await this.findTodoListOrFail(id, user);
    list.title = updateTodoListDto.title;

    await this.listRepo.save(list);

    return list;
  }

  async remove(id: string, user: User) {
    const list = await this.findTodoListOrFail(id, user);
    await this.listRepo.delete(list);
  }

  async findTodoListOrFail(id: string, user: User): Promise<TodoList> {
    const list = await this.listRepo.findOneBy({ id, userId: user.id });
    if (!list) throw new NotFoundException('List not found');
    return list;
  }

  async touchTodoList(list: TodoList): Promise<void> {
    list.lastItemUpdatedAt = new Date();

    await this.listRepo.save(list);
  }
}
