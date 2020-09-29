import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../DTOS/UserDTO';
import { Workplace } from 'src/models/workplace.entity';
import { Project } from 'src/models/project.entity';
import { Locations } from '../users/enums/location.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Workplace)
    private readonly workPlaceRepository: Repository<Workplace>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  public async create(userDTO: UserDTO): Promise<any> {
    const user = this.usersRepository.create(userDTO);

    user.password = await bcrypt.hash(user.password, 10);

    const created = await this.usersRepository.save(user);

    return created;
  }

  public async holidayStart(
    userId: number,
    HolidayStartDate: any,
    HolidayEndDate: any,
  ) {
    const user = await this.findOneOrFail(userId);
    user.HolidayStartDate = HolidayStartDate.HolidayStartDate as Date;
    user.HolidayEndDate = HolidayStartDate.HolidayEndDate as Date;

    return await this.usersRepository.save(user);
  }

  public async deleteHoliday(userId: number) {
    const user = await this.findOneOrFail(userId);

    const userWithoutHoliday = {
      ...user,
      HolidayStartDate: null,
      HolidayEndDate: null,
    };
    return await this.usersRepository.save(userWithoutHoliday);
  }

  public async getUserInfo() {
    const result = await this.usersRepository.find({
      relations: ['project'],
    });
    const newResult = result.map(el => ({
      ...el,
      location: Locations[el.location],
      project: el.project.name,
    }));

    return newResult;
  }

  public async getUsersByCountry(countryName: string) {
    const users = await this.usersRepository.find({
      where: {
        country: countryName,
      },
      relations: ['project'],
    });
    return await this.usersRepository.save(users);
  }

  public async getUserWorkplace(userId: number) {
    return await this.workPlaceRepository.find({
      where: {
        user: userId,
      },
      relations: ['user'],
    });
  }

  public async banUser(userId: number, period: number) {
    const user = await this.findOneOrFail(userId);

    user.banEndDate = new Date(Date.now() + period);

    return await this.usersRepository.save(user);
  }

  private async findOneOrFail(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new Error('No user!');
    }

    return user;
  }
}
