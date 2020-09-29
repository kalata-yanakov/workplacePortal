import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidData } from 'src/models/covidData.entity';
import { Cron } from '@nestjs/schedule';
import { Country } from 'src/models/country.entity';
import { Workplace } from 'src/models/workplace.entity';
import { User } from 'src/models/user.entity';
import { Locations } from 'src/users/enums/location.enum';
const fetch = require('node-fetch');
const moment = require('moment');

@Injectable()
export class CovidDataService {
  constructor(
    @InjectRepository(CovidData)
    private readonly covidDataRepository: Repository<CovidData>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Cron('0 17 * * * *')
  handleCron() {
    //     fetch('https://coronavirus-19-api.herokuapp.com/countries')
    //     .then(response => response.json())
    //     .then(async data => {
    //    const countriesToUpdate = await this.countryRepository.find()
    //    const result = countriesToUpdate.map(country => {
    //        return data.find(data =>
    //        country.name === data.country
    //        )});
    //        const addPercent = result.map(e => ({...e, 'infectedPercent': (Number((e.casesPerOneMillion/e.testsPerOneMillion) * 100).toFixed(2))}))
    //   const workplacesToUpdate =  await this.workplaceRepository.find({
    //     relations: ['country']
    //   });
    //  workplacesToUpdate.map((e) => {
    //     addPercent.map(el => {
    //       if(el.country === e.country.name){
    //         e.currentPercent = el.infectedPercent
    //       }
    //     })
    //   })
    //
    //   const updateWorkplaces = await this.workplaceRepository.save(workplacesToUpdate)
    //    const result1 = await this.covidDataRepository.create(addPercent)
    //    const result2 = result1.map(e => ({...e, country: countriesToUpdate.filter(el => el.name as any === e.country)}))
    //
    //    const finRes = result2.map(e => ({...e, country: e.country[0].id, 'date': moment().format('YYYY-MM-DD')} ));
    //
    //  const asdf = await this.covidDataRepository.save(finRes as any)
    // });
  }

  async test(): Promise<any> {
    fetch('https://coronavirus-19-api.herokuapp.com/countries')
      .then(response => response.json())
      .then(async data => {
        const countriesToUpdate = await this.countryRepository.find();
        const result = countriesToUpdate.map(country => {
          return data.find(data => country.name === data.country);
        });
        const addPercent = result.map(e => ({
          ...e,
          infectedPercent: (
            (e.casesPerOneMillion / e.testsPerOneMillion) *
            100
          ).toFixed(2),
        }));

        const workplacesToUpdate = await this.workplaceRepository.find({
          relations: ['country'],
        });

        workplacesToUpdate.map(e => {
          addPercent.map(el => {
            if (el.country === e.country.name) {
              e.currentPercent = el.infectedPercent;
            }
          });
        });

        const updateWorkplaces = await this.workplaceRepository.save(
          workplacesToUpdate,
        );

        const result1 = await this.covidDataRepository.create(addPercent);
        const result2 = result1.map(e => ({
          ...e,
          country: countriesToUpdate.filter(
            el => (el.name as any) === e.country,
          ),
        }));

        const finRes = result2.map(e => ({
          ...e,
          country: e.country[0].id,
          date: moment().format('YYYY-MM-DD'),
        }));

        const asdf = await this.covidDataRepository.save(finRes as any);
      });
  }

  async getCovidData(): Promise<any> {
    fetch('https://coronavirus-19-api.herokuapp.com/countries')
      .then(response => response.json())
      .then(async data => {
        data.forEach(async element => {
          const countries = await this.covidDataRepository.find({
            relations: ['country'],
          });

          const country = countries.find(
            el => el.country.name === element.country,
          );

          if (country) {
            let newC = await this.covidDataRepository.findOne(country);

            newC = { ...newC, ...element };
            const finalC = this.covidDataRepository.create(newC);

            await this.covidDataRepository.save(finalC);
          } else {
            const countriesToUpdate = await this.countryRepository.find();

            if (countriesToUpdate.some(el => el.name === element.country)) {
              const final = this.covidDataRepository.create({
                country: countriesToUpdate.find(
                  el => el.name === element.country,
                ),
                cases: element.cases,
                todayCases: element.todayCases,
                testsPerOneMillion: element.testsPerOneMillion,
              });

              await this.covidDataRepository.save(final);
            }
          }
        });
      });
  }

  async covidInfo(): Promise<any> {
    const result = await this.covidDataRepository.find({
      relations: ['country'],
    });
    const newResult = result.map(el => ({ ...el, country: el.country.name }));
    return newResult;
  }

  filteringFunction = (percent, employees) => {
    if (percent > 10) {
      return employees.map((user, i) => {
        if (i % 2 === 0) {
          user.location = Locations[1];
        } else {
          user.location = Locations[2];
        }
        if (user.HolidayStartDate !== null) {
          user.location = Locations[3];
        }
        return user;
      });
    } else if (percent >= 5 && percent <= 10) {
      return employees.map((user, i) => {
        if (i % 3 === 0) {
          user.location = Locations[2];
        } else {
          user.location = Locations[1];
        }
        if (user.HolidayStartDate !== null) {
          user.location = Locations[3];
        }
        return user;
      });
    } else {
      return employees.map(user => ({ ...user, location: 'Office' }));
    }
  };

  async changeScheduleByPercetFirstWeek(): Promise<any> {
    const countries = await this.covidInfo();

    const newCoutries = countries.map(country => ({
      ...country,
      infectedPercent: Math.floor(
        ((country.todayCases * 7) / country.testsPerOneMillion) * 100,
      ),
    }));

    let users = await this.userRepository.find({
      relations: ['project'],
    });

    const findMatchingCountries = newCoutries.filter(({ country: country1 }) =>
      users.some(({ country: country2 }) => country1 === country2),
    );

    const extractedPercentwithUsers = findMatchingCountries
      .map(({ infectedPercent, country }) => ({ infectedPercent, country }))
      .map(element => {
        const obj = { infectedPercent: element.infectedPercent, users: [] };
        users.forEach(user => {
          if (user.country === element.country) {
            obj.users.push(user);
          }
        });
        return obj;
      });

    const result = extractedPercentwithUsers.map(el =>
      this.filteringFunction(
        el.infectedPercent,
        el.users.map(elements => ({
          ...elements,
          project: elements.project.name,
        })),
      ),
    );

    return result;
  }

  async changeScheduleByPercetNextWeek(): Promise<any> {
    const getPeopleFromFirstWeek = await this.changeScheduleByPercetFirstWeek();
    const reversedPeoplesSchedule = getPeopleFromFirstWeek
      .flat()
      .map(person => {
        if (person.location === Locations[2]) {
          person.location = Locations[1];
        } else if (person.location === Locations[1]) {
          person.location = Locations[2];
        }
        return person;
      });
    return reversedPeoplesSchedule;
  }
}
