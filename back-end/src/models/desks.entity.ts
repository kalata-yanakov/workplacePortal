import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SingleDesk } from './singleDesk.entity';

@Entity()
export class Desks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deskNumber: number;

  @OneToMany(
    () => SingleDesk,
    singledesk => singledesk.desks,
  )
  desks: SingleDesk[];
}
