import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/models/country.entity';
import { Repository } from 'typeorm';
import { Workplace } from 'src/models/workplace.entity';
import { CountryDTO } from 'src/DTOS/CreateCountry.DTO';
import { CovidData } from 'src/models/covidData.entity';
import e = require('express');
const moment = require('moment');

let rearangeDesks = matrix => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (i === 0) {
        if (
          matrix[i][j] === 1 &&
          (matrix[i][j + 1] === 1 || matrix[i][j + 1] === 1)
        ) {
          matrix[i][j] === 2;
        }
      }
      if (i > 0) {
        if (
          (matrix[i - 1][j] === 1 || matrix[i - 1][j] === 0) &&
          matrix[i][j] === 1 &&
          matrix[i][j - 1] !== 2
        ) {
          matrix[i][j] = 2;
        }
      }
    }
  }
};

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
    @InjectRepository(CovidData)
    private readonly covidDataRepository: Repository<CovidData>,
  ) {}

  public async getCountryData() {
    const workplaceData = await this.workplaceRepository.find({
      relations: [
        'country',
        'floorplaning',
        'desks',
        'desks.desks',
        'desks.desks.user',
      ],
    });

    workplaceData.map(e => {
      if (Number(e.currentPercent) > e.floorplaning.ratio50) {
        let matrix = JSON.parse(e.matrixmodel);

        rearangeDesks(matrix.matrix);

        e.matrixmodel = JSON.stringify(matrix);
      }
    });

    workplaceData.map(e =>
      e.desks.desks.map(e => {
        if (e.user !== null) {
          (e.user as any) = {
            id: e.user.id,
            username: e.user.username,
            project: e.user.project,
            firstName: e.user.firstName,
            email: e.user.email,
          };
        }
      }),
    );

    return workplaceData;
  }

  public async addNewCountry(country: CountryDTO) {
    const newCountry = this.countryRepository.create(country);
    const addCountry = await this.countryRepository.save(newCountry);

    return addCountry;
  }
}
