import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { TodoItemsService } from './todo-items.service';
import { TodoListsService } from './todo-lists.service';
import { Repository } from 'typeorm';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { TodoList } from './entities/todo-list.entity';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoItemsService', () => {
  let service: TodoItemsService;
  let itemRepo: Repository<TodoItem>;
  let listService: TodoListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TodoItem),
          useFactory: () => ({
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          }),
        },
        {
          provide: TodoListsService,
          useFactory: () => ({
            touchTodoList: jest.fn(),
          }),
        },
        TodoItemsService,
      ],
    }).compile();

    service = module.get<TodoItemsService>(TodoItemsService);
    itemRepo = module.get<Repository<TodoItem>>(getRepositoryToken(TodoItem));
    listService = module.get<TodoListsService>(TodoListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo list item', async () => {
      const createTodoItemDto = { title: 'todo item 1' } as CreateTodoItemDto;
      const list = { id: 'id' } as TodoList;
      jest.spyOn(itemRepo, 'save');
      jest.spyOn(listService, 'touchTodoList');

      const res = await service.create(createTodoItemDto, list);

      expect(res.title).toStrictEqual(createTodoItemDto.title);
      expect(res.todoList.id).toStrictEqual(list.id);
      expect(itemRepo.save).toHaveBeenCalledTimes(1);
      expect(listService.touchTodoList).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it("should find all todo list's items", async () => {
      const list = { id: 'id' } as TodoList;
      jest.spyOn(itemRepo, 'find');

      await service.findAll(list);

      expect(itemRepo.find).toHaveBeenCalledTimes(1);
      expect(itemRepo.find).toHaveBeenCalledWith({
        where: { todoListId: list.id },
        order: { priority: -1 },
      });
    });
  });

  describe('update', () => {
    it('should update a todo list item', async () => {
      const id = 'id';
      const createTodoItemDto = { title: 'todo item 1' } as UpdateTodoItemDto;
      const list = { id: 'id' } as TodoList;
      jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue({
        ...createTodoItemDto,
        id,
        todoList: list,
      } as TodoItem);
      jest.spyOn(itemRepo, 'save');
      jest.spyOn(listService, 'touchTodoList');

      const res = await service.update(id, createTodoItemDto, list);

      expect(res.title).toStrictEqual(createTodoItemDto.title);
      expect(res.todoList.id).toStrictEqual(list.id);
      expect(res.id).toStrictEqual(id);
      expect(itemRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(itemRepo.save).toHaveBeenCalledTimes(1);
      expect(listService.touchTodoList).toHaveBeenCalledTimes(1);
    });

    it('should not update a todo list item', async () => {
      const id = 'id';
      const createTodoItemDto = { title: 'todo item 1' } as UpdateTodoItemDto;
      const list = { id: 'id' } as TodoList;
      jest.spyOn(itemRepo, 'findOneBy').mockImplementation(async () => {
        throw new NotFoundException('List not found');
      });
      jest.spyOn(itemRepo, 'save');
      jest.spyOn(listService, 'touchTodoList');

      expect(async () => {
        await service.update(id, createTodoItemDto, list);
      }).rejects.toThrow(NotFoundException);

      expect(itemRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(itemRepo.save).toHaveBeenCalledTimes(0);
      expect(listService.touchTodoList).toHaveBeenCalledTimes(0);
    });
  });

  describe('remove', () => {
    it("should remove the todo list's item", async () => {
      const id = 'id';
      const createTodoItemDto = { title: 'todo item 1' } as UpdateTodoItemDto;
      const list = { id: 'id' } as TodoList;
      jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue({
        ...createTodoItemDto,
        id,
        todoList: list,
      } as TodoItem);
      jest.spyOn(itemRepo, 'delete');
      jest.spyOn(listService, 'touchTodoList');
      await service.remove(id, list);

      expect(itemRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(itemRepo.delete).toHaveBeenCalledTimes(1);
      expect(listService.touchTodoList).toHaveBeenCalledTimes(1);
    });
  });
});
