import {
  Injectable,
  CanActivate,
  ForbiddenException,
  ExecutionContext,
} from '@nestjs/common';
import { UserRequest } from '../../auth/types/user-request.type';
import { TodoListsService } from '../todo-lists.service';

@Injectable()
export class TodoListGuard implements CanActivate {
  constructor(private readonly todoListsService: TodoListsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: UserRequest = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException();
    }
    if (request.params?.todoListId) {
      const list = await this.todoListsService.findTodoListOrFail(
        request.params.todoListId,
        request.user,
      );

      request['list'] = list;
    }
    return true;
  }
}
