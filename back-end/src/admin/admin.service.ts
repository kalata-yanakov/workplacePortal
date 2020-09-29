import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Workplace } from 'src/models/workplace.entity';
import { FloorPlaning } from 'src/models/floorPlaning.entity';

import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
import { SingleDesk } from 'src/models/singleDesk.entity';

const fetch = require('node-fetch');

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
    @InjectRepository(FloorPlaning)
    private readonly floorplaningRepository: Repository<FloorPlaning>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SingleDesk)
    private readonly singleDeskRepository: Repository<SingleDesk>,
  ) {}

  async getUsers(id: number): Promise<any> {
    const foundUsers = await this.workplaceRepository.findOne({
      where: {
        id,
      },
      relations: ['users'],
    });

    const result = foundUsers.users.map(e => {
      return ((e as any) = {
        id: e.id,
        username: e.username,
        project: e.project,
        firstName: e.firstName,
        email: e.email,
      });
    });
    return result;
  }

  async changeVertical(id: number, vertical: any): Promise<any> {
    const findWorkplace = await this.findWorkplaceOrFail(id);

    const verticalUpdate = await this.floorplaningRepository.findOne({
      where: {
        id: findWorkplace.floorplaning.id,
      },
    });

    verticalUpdate.vertical = vertical.vertical;
    return await this.floorplaningRepository.save(verticalUpdate);
  }

  async changeHorizontal(id: number, horizontal: any): Promise<any> {
    const findWorkplace = await this.findWorkplaceOrFail(id);

    const horizontalUpdate = await this.floorplaningRepository.findOne({
      where: {
        id: findWorkplace.floorplaning.id,
      },
    });

    horizontalUpdate.horizontal = horizontal.horizontal;
    return await this.floorplaningRepository.save(horizontalUpdate);
  }

  async changetreshhold(id: number, treshhold: any) {
    const findWorkplace = await this.findWorkplaceOrFail(id);

    const treshholdUpdate = await this.floorplaningRepository.findOne({
      where: {
        id: findWorkplace.floorplaning.id,
      },
    });

    treshholdUpdate.ratio50 = treshhold.newRatios[0];
    treshholdUpdate.ratio75 = treshhold.newRatios[1];

    await this.floorplaningRepository.save(treshholdUpdate);
    return await this.floorplaningRepository.findOne({
      where: {
        id: findWorkplace.floorplaning.id,
      },
    });
  }

  async changeFloorPlan(id: number, floorplan: any): Promise<any> {
    const findWorkplace = await this.findWorkplaceOrFail(id);

    const planToUpdate = await this.floorplaningRepository.findOne({
      where: {
        id: findWorkplace.floorplaning.id,
      },
    });

    planToUpdate.plan = floorplan.floorplan;
    return await this.floorplaningRepository.save(planToUpdate);
  }

  public async updateUserProp(user: any) {
    if (user.location === 'Vacation') {
      user.location = 3;
    } else if (user.location === 'Office') {
      user.location = 1;
    } else if (user.location === 'Home') {
      user.location = 2;
    }
    const foundProject = await this.projectRepository.findOne({
      where: {
        name: user.project,
      },
    });
    user.project = foundProject.id;

    return await this.userRepository.save(user);
  }
  async assingUserToProject(projectid: number, userid: number) {
    const findProject = await this.projectRepository.findOne({
      where: {
        id: projectid,
      },
    });

    const findUser = await this.userRepository.findOne({
      where: {
        id: userid,
      },
    });

    findUser.project = findProject;
    return await this.userRepository.save(findUser);
  }

  async assignUserToDesk(deskid: number, userid: number) {
    const findDesk = await this.singleDeskRepository.findOne({
      where: {
        id: deskid,
      },
      relations: ['user'],
    });

    const findUser = await this.userRepository.findOne({
      where: {
        id: userid,
      },
      relations: ['singledesk'],
    });

    if (findUser.singledesk !== null) {
      findUser.singledesk.user = null;
      await this.singleDeskRepository.save(findUser.singledesk);
    }

    if (findDesk.user !== null) {
      findDesk.user.singledesk = null;
      await this.userRepository.save(findDesk.user);
    }

    const findDesk1 = await this.singleDeskRepository.findOne({
      where: {
        id: deskid,
      },
      relations: ['user'],
    });

    const findUser1 = await this.userRepository.findOne({
      where: {
        id: userid,
      },
      relations: ['singledesk'],
    });

    findDesk1.user = findUser1;

    return await this.singleDeskRepository.save(findDesk1);
  }

  async findWorkplaceOrFail(id: number) {
    const result = await this.workplaceRepository.findOne({
      where: {
        id,
      },
      relations: ['floorplaning'],
    });

    if (!result) {
      throw new Error('No such workspace!');
    } else {
      return result;
    }
  }

  async findAllUsersAndChangeLocation(user: any) {
    const foundProject = await this.projectRepository.findOne({
      where: {
        name: user.project,
      },
    });
    user.project = foundProject.id;
    const users = await this.userRepository.find();
  }
}
