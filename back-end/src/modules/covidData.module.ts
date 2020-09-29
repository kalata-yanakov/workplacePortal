import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CovidData } from 'src/models/covidData.entity';
import { covidDataController } from 'src/controller/covidData.controller';
import { CovidDataService } from 'src/services/covidData.service';
import { Country } from 'src/models/country.entity';
import { User } from 'src/models/user.entity';
import { Workplace } from 'src/models/workplace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CovidData, Country, Workplace, User]),
    AuthModule,
  ],
  controllers: [covidDataController],
  providers: [CovidDataService],
})
export class CovidDataModule {}
