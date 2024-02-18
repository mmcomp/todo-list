import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoItem } from './todo-item.entity';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastItemUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TodoItem, (item) => item.todoList)
  items: TodoItem[];
}
