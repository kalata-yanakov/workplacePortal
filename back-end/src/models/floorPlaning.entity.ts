import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Plan } from 'src/constants/enums';

@Entity()
export class FloorPlaning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 5 })
  ratio50: number;
  @Column({ default: 10 })
  ratio75: number;
  @Column()
  horizontal: number;
  @Column()
  vertical: number;
  @Column({ type: 'enum', enum: Plan })
  plan: Plan;
}
