import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Desks } from './desks.entity';
import { User } from './user.entity';

@Entity()
export class SingleDesk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avaiable: boolean;

  @Column({ nullable: true })
  forbidden: boolean;

  @Column({ default: false })
  occupied: boolean;

  @ManyToOne(
    () => Desks,
    desks => desks.desks,
  )
  desks: Desks;

  @OneToOne(
    () => User,

    user => user.singledesk,
    {
      cascade: true,

      nullable: true,
    },
  )
  @JoinColumn()
  user: User;
}
