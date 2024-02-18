import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 500, nullable: false })
  password: string;
}
