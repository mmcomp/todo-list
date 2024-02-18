import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoList } from './entities/todo-list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { TodoListsService } from './todo-lists.service';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem) private readonly itemRepo: Repository<TodoItem>,
    private readonly listService: TodoListsService,
  ) {}

  async create(
    createTodoItemDto: CreateTodoItemDto,
    list: TodoList,
  ): Promise<TodoItem> {
    const item = createTodoItemDto as TodoItem;
    item.todoList = list;
    await this.itemRepo.save(item);

    await this.listService.touchTodoList(list);

    return item;
  }

  findAll({ id: todoListId }: TodoList): Promise<TodoItem[]> {
    return this.itemRepo.find({
      where: { todoListId },
      order: { priority: -1 },
    });
  }

  async update(
    id: string,
    updateTodoItemDto: UpdateTodoItemDto,
    list: TodoList,
  ): Promise<TodoItem> {
    const item = await this.findTodoItemOrFail(id, list);
    await this.itemRepo.save({ ...item, ...updateTodoItemDto });

    await this.listService.touchTodoList(list);

    return item;
  }

  async remove(id: string, list: TodoList) {
    const item = await this.findTodoItemOrFail(id, list);
    await this.itemRepo.delete(item);
    await this.listService.touchTodoList(list);
  }

  async findTodoItemOrFail(
    id: string,
    { id: todoListId }: TodoList,
  ): Promise<TodoItem> {
    const item = await this.itemRepo.findOneBy({ id, todoListId });
    if (!item) throw new NotFoundException('List not found');
    return item;
  }
}
