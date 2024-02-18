import { IsString, MinLength } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  @MinLength(3)
  title: string;
}
