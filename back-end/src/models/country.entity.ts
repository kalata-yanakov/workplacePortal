import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workplace } from './workplace.entity';
import { CovidData } from './covidData.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => CovidData,
    covidData => covidData.country,
  )
  covidData: CovidData[];

  @OneToMany(
    () => Workplace,
    workplace => workplace.name,
  )
  workplace: Workplace[];
}
