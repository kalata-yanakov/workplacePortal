import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CountryController } from 'src/controller/country.controller';
import { CountryService } from 'src/services/country.service';
import { Country } from 'src/models/country.entity';
import { Workplace } from 'src/models/workplace.entity';
import { CovidData } from 'src/models/covidData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Workplace, CovidData]),
    AuthModule,
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
