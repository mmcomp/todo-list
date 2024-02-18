import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthService } from '../auth/auth.service';
import { TodoItemsService } from '../todo-lists/todo-items.service';
import { TodoListsService } from '../todo-lists/todo-lists.service';
import { AuthGuard } from '../todo-lists/guards/auth.guard';
import { TodoListGuard } from '../todo-lists/guards/todo-list.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { CreateTodoListDto } from '../todo-lists/dto/create-todo-list.dto';
import { UserRequest } from '../auth/types/user-request.type';
import { User } from '../users/entities/user.entity';
import { UpdateTodoListDto } from '../todo-lists/dto/update-todo-list.dto';
import { CreateTodoItemDto } from '../todo-lists/dto/create-todo-item.dto';
import { ListRequest } from '../todo-lists/types/list-request.type';
import { TodoList } from '../todo-lists/entities/todo-list.entity';
import { UpdateTodoItemDto } from '../todo-lists/dto/update-todo-item.dto';

describe('ApiGatewayController', () => {
  let controller: ApiGatewayController;
  let authService: AuthService;
  let todoListsService: TodoListsService;
  let todoItemsService: TodoItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            registerUser: jest.fn(),
            loginUser: jest.fn(),
          }),
        },
        {
          provide: TodoListsService,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          }),
        },
        {
          provide: TodoItemsService,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          }),
        },
        {
          provide: AuthGuard,
          useFactory: () => ({}),
        },
        {
          provide: TodoListGuard,
          useFactory: () => ({}),
        },
        {
          provide: JwtService,
          useFactory: () => ({}),
        },
        {
          provide: ConfigService,
          useFactory: () => ({}),
        },
        {
          provide: UsersService,
          useFactory: () => ({}),
        },
      ],
      controllers: [ApiGatewayController],
    }).compile();

    controller = module.get<ApiGatewayController>(ApiGatewayController);
    authService = module.get<AuthService>(AuthService);
    todoListsService = module.get<TodoListsService>(TodoListsService);
    todoItemsService = module.get<TodoItemsService>(TodoItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Auth', () => {
    describe('register', () => {
      it('should call authService.registerUser', async () => {
        const request = {
          name: 'Mehrdad',
          email: 'm.mirsamie@gmail.com',
          password: '123456',
        } as CreateUserDto;
        jest.spyOn(authService, 'registerUser');
        await controller.register(request);

        expect(authService.registerUser).toHaveBeenCalledTimes(1);
        expect(authService.registerUser).toHaveBeenCalledWith(request);
      });
    });

    describe('login', () => {
      it('should call authService.loginUser', async () => {
        const request = {
          email: 'm.mirsamie@gmail.com',
          password: '123456',
        } as LoginUserDto;
        jest.spyOn(authService, 'loginUser');
        await controller.login(request);

        expect(authService.loginUser).toHaveBeenCalledTimes(1);
        expect(authService.loginUser).toHaveBeenCalledWith(request);
      });
    });
  });

  describe('TodoList', () => {
    describe('createTodoList', () => {
      it('should call todoListsService.create', async () => {
        const request = {
          title: 'TodoList1',
        } as CreateTodoListDto;
        const userRequest = {
          user: {
            id: 'test-id',
          } as User,
        } as UserRequest;
        jest.spyOn(todoListsService, 'create');
        await controller.createTodoList(request, userRequest);

        expect(todoListsService.create).toHaveBeenCalledTimes(1);
        expect(todoListsService.create).toHaveBeenCalledWith(
          request,
          userRequest.user,
        );
      });
    });

    describe('findAllTodoLists', () => {
      it('should call todoListsService.findAll', async () => {
        const userRequest = {
          user: {
            id: 'test-id',
          } as User,
        } as UserRequest;
        jest.spyOn(todoListsService, 'findAll');
        await controller.findAllTodoLists(userRequest);

        expect(todoListsService.findAll).toHaveBeenCalledTimes(1);
        expect(todoListsService.findAll).toHaveBeenCalledWith(userRequest.user);
      });
    });

    describe('updateTodoList', () => {
      it('should call todoListsService.update', async () => {
        const id = 'id';
        const request = {
          title: 'TodoList1',
        } as UpdateTodoListDto;
        const userRequest = {
          user: {
            id: 'test-id',
          } as User,
        } as UserRequest;
        jest.spyOn(todoListsService, 'update');
        await controller.updateTodoList(id, request, userRequest);

        expect(todoListsService.update).toHaveBeenCalledTimes(1);
        expect(todoListsService.update).toHaveBeenCalledWith(
          id,
          request,
          userRequest.user,
        );
      });
    });

    describe('removeTodoList', () => {
      it('should call todoListsService.remove', async () => {
        const id = 'id';
        const userRequest = {
          user: {
            id: 'test-id',
          } as User,
        } as UserRequest;
        jest.spyOn(todoListsService, 'remove');
        await controller.removeTodoList(id, userRequest);

        expect(todoListsService.remove).toHaveBeenCalledTimes(1);
        expect(todoListsService.remove).toHaveBeenCalledWith(
          id,
          userRequest.user,
        );
      });
    });
  });

  describe('TodoItem', () => {
    describe('createTodoItem', () => {
      it('should call todoItemsService.create', async () => {
        const request = {
          title: 'TodoList1',
        } as CreateTodoItemDto;
        const listRequest = {
          list: {
            id: 'test-id',
          } as TodoList,
        } as ListRequest;
        jest.spyOn(todoItemsService, 'create');
        await controller.createTodoItem(request, listRequest);

        expect(todoItemsService.create).toHaveBeenCalledTimes(1);
        expect(todoItemsService.create).toHaveBeenCalledWith(
          request,
          listRequest.list,
        );
      });
    });

    describe('findAllTodoItems', () => {
      it('should call todoItemsService.findAll', async () => {
        const listRequest = {
          list: {
            id: 'test-id',
          } as TodoList,
        } as ListRequest;
        jest.spyOn(todoItemsService, 'findAll');
        await controller.findAllTodoItems(listRequest);

        expect(todoItemsService.findAll).toHaveBeenCalledTimes(1);
        expect(todoItemsService.findAll).toHaveBeenCalledWith(listRequest.list);
      });
    });

    describe('updateTodoItem', () => {
      it('should call todoItemsService.update', async () => {
        const id = 'id';
        const request = {
          title: 'TodoList1',
        } as UpdateTodoItemDto;
        const listRequest = {
          list: {
            id: 'test-id',
          } as TodoList,
        } as ListRequest;
        jest.spyOn(todoItemsService, 'update');
        await controller.updateTodoItem(id, request, listRequest);

        expect(todoItemsService.update).toHaveBeenCalledTimes(1);
        expect(todoItemsService.update).toHaveBeenCalledWith(
          id,
          request,
          listRequest.list,
        );
      });
    });

    describe('removeTodoItem', () => {
      it('should call todoItemsService.remove', async () => {
        const id = 'id';
        const listRequest = {
          list: {
            id: 'test-id',
          } as TodoList,
        } as ListRequest;
        jest.spyOn(todoItemsService, 'remove');
        await controller.removeTodoItem(id, listRequest);

        expect(todoItemsService.remove).toHaveBeenCalledTimes(1);
        expect(todoItemsService.remove).toHaveBeenCalledWith(
          id,
          listRequest.list,
        );
      });
    });
  });
});
