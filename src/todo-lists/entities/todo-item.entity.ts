import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoList } from './todo-list.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'varchar' })
  todoListId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TodoList, (todoList) => todoList.items)
  todoList: TodoList;
}
