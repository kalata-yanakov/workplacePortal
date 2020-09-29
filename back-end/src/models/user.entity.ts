import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Locations } from 'src/users/enums/location.enum';
import { Workplace } from './workplace.entity';
import { Project } from './project.entity';
import { SingleDesk } from './singleDesk.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  password: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  HolidayStartDate: Date;

  @Column({ nullable: true })
  HolidayEndDate: Date;

  @Column({ nullable: true })
  banEndDate: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Basic })
  role: UserRole;

  @Column({ type: 'enum', enum: Locations, default: Locations.Office })
  location: Locations;

  @ManyToOne(
    () => Project,
    project => project.users,
  )
  project: Project;

  @OneToOne(
    () => SingleDesk,
    singledesk => singledesk.user,
  )
  singledesk: SingleDesk;

  @ManyToOne(
    () => Workplace,
    workplace => workplace.users,
  )
  workplace: Workplace;
}
