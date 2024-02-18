import { UserRequest } from '../../auth/types/user-request.type';
import { TodoList } from '../entities/todo-list.entity';

export type ListRequest = UserRequest & { list: TodoList };
