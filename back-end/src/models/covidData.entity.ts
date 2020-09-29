import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class CovidData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Country,
    country => country.covidData,
  )
  country: Country;

  @Column()
  cases: number;
  @Column({ nullable: true })
  todayCases: number;

  @Column()
  testsPerOneMillion: number;

  @Column({ default: new Date().toISOString().slice(0, 10) })
  date: Date;

  @Column({ nullable: true })
  infectedPercent: number;
}
