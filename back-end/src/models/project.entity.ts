import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(
    () => User,
    user => user.project,
  )
  users: User[];
}
