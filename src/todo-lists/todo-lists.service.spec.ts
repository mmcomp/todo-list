import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from './todo-lists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoList } from './entities/todo-list.entity';

describe('TodoListsService', () => {
  let service: TodoListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TodoList),
          useFactory: () => ({}),
        },
        TodoListsService,
      ],
    }).compile();

    service = module.get<TodoListsService>(TodoListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
