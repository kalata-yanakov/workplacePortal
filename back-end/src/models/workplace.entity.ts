import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Country } from './country.entity';
import { FloorPlaning } from './floorPlaning.entity';
import { Desks } from './desks.entity';
import { User } from './user.entity';

@Entity()
export class Workplace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  matrixmodel: string;

  @Column({ nullable: true })
  currentPercent: string;

  @ManyToOne(
    () => Country,
    country => country.workplace,
  )
  country: Country;

  @OneToOne(() => FloorPlaning)
  @JoinColumn()
  floorplaning: FloorPlaning;

  @OneToOne(() => Desks)
  @JoinColumn()
  desks: Desks;

  @OneToMany(
    () => User,
    user => user.workplace,
  )
  users: User[];
}
