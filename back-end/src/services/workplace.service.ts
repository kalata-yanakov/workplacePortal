import { InjectRepository } from '@nestjs/typeorm';
import { Workplace } from 'src/models/workplace.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
  ) {}

  async saveMatrixModel(workplaceId: number, matrixModel: [][]) {
    const findWorkplace = await this.workplaceRepository.findOne({
      where: {
        id: workplaceId,
      },
    });

    const matrixToSave = JSON.stringify(matrixModel);

    findWorkplace.matrixmodel = matrixToSave;

    return await this.workplaceRepository.save(findWorkplace);
  }
}
