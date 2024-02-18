import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UserRequest } from '../auth/types/user-request.type';
import { CreateTodoListDto } from '../todo-lists/dto/create-todo-list.dto';
import { UpdateTodoListDto } from '../todo-lists/dto/update-todo-list.dto';
import { AuthGuard } from '../todo-lists/guards/auth.guard';
import { TodoListsService } from '../todo-lists/todo-lists.service';
import { TodoItemsService } from '../todo-lists/todo-items.service';
import { CreateTodoItemDto } from '../todo-lists/dto/create-todo-item.dto';
import { UpdateTodoItemDto } from '../todo-lists/dto/update-todo-item.dto';
import { TodoListGuard } from '../todo-lists/guards/todo-list.guard';
import { ListRequest } from '../todo-lists/types/list-request.type';

@Controller('api')
export class ApiGatewayController {
  constructor(
    private readonly authService: AuthService,
    private readonly todoListsService: TodoListsService,
    private readonly todoItemsService: TodoItemsService,
  ) {}

  // Auth
  @Post('auth/register')
  register(@Body() createUserDto: CreateUserDto): Promise<{ access_token }> {
    return this.authService.registerUser(createUserDto);
  }

  @Post('auth/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token }> {
    return this.authService.loginUser(loginUserDto);
  }

  // TodoList
  @UseGuards(AuthGuard)
  @Post('todo-lists')
  createTodoList(
    @Body() createTodoListDto: CreateTodoListDto,
    @Req() { user }: UserRequest,
  ) {
    return this.todoListsService.create(createTodoListDto, user);
  }

  @UseGuards(AuthGuard)
  @Get('todo-lists')
  findAllTodoLists(@Req() { user }: UserRequest) {
    return this.todoListsService.findAll(user);
  }

  @UseGuards(AuthGuard)
  @Patch('todo-lists/:id')
  updateTodoList(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
    @Req() { user }: UserRequest,
  ) {
    return this.todoListsService.update(id, updateTodoListDto, user);
  }

  @UseGuards(AuthGuard)
  @Delete('todo-lists/:id')
  removeTodoList(@Param('id') id: string, @Req() { user }: UserRequest) {
    return this.todoListsService.remove(id, user);
  }

  // TodoItem
  @UseGuards(AuthGuard, TodoListGuard)
  @Post('todo-items/:todoListId')
  createTodoItem(
    @Body() createTodoItemDto: CreateTodoItemDto,
    @Req() { list }: ListRequest,
  ) {
    return this.todoItemsService.create(createTodoItemDto, list);
  }

  @UseGuards(AuthGuard, TodoListGuard)
  @Get('todo-items/:todoListId')
  findAllTodoItems(@Req() { list }: ListRequest) {
    return this.todoItemsService.findAll(list);
  }

  @UseGuards(AuthGuard, TodoListGuard)
  @Patch('todo-items/:todoListId/update/:id')
  updateTodoItem(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
    @Req() { list }: ListRequest,
  ) {
    return this.todoItemsService.update(id, updateTodoItemDto, list);
  }

  @UseGuards(AuthGuard, TodoListGuard)
  @Delete('todo-items/:todoListId/delete/:id')
  removeTodoItem(@Param('id') id: string, @Req() { list }: ListRequest) {
    return this.todoItemsService.remove(id, list);
  }
}
