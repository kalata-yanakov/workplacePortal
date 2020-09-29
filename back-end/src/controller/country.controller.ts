import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryService } from 'src/services/country.service';
import { CountryDTO } from 'src/DTOS/CreateCountry.DTO';

@Controller('/api/country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  public async getCountryData(): Promise<any> {
    return await this.countryService.getCountryData();
  }

  @Post('addCountry')
  public async addNewCountry(@Body() country: CountryDTO): Promise<any> {
    return await this.countryService.addNewCountry(country);
  }
}
