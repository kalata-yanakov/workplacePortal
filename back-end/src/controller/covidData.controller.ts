import { Controller, Get, Post } from '@nestjs/common';
import { CovidDataService } from 'src/services/covidData.service';

@Controller('/api/covidData')
export class covidDataController {
  constructor(private readonly covidDataService: CovidDataService) {}

  @Get('covidInfo')
  public async covidInfo(): Promise<any> {
    return await this.covidDataService.covidInfo();
  }

  @Get('getData')
  public async getCovidData(): Promise<any> {
    return await this.covidDataService.getCovidData();
  }

  @Post('test')
  public async test(): Promise<any> {
    return await this.covidDataService.test();
  }

  @Get('changesByPercentFirstWeek')
  public async changeScheduleByPercetFirstWeek(): Promise<any> {
    return await this.covidDataService.changeScheduleByPercetFirstWeek();
  }

  @Get('changesByPercentNextWeek')
  public async changesByPercentNextWeek(): Promise<any> {
    return await this.covidDataService.changeScheduleByPercetNextWeek();
  }
}
