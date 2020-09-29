import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { CountryModule } from './modules/country.module';
import { ProjectModule } from './modules/project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CovidDataModule } from './modules/covidData.module';
import { WorkplaceModule } from './modules/workplace.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailsModule } from './modules/emails.module';

@Module({
  imports: [
    EmailsModule,
    UsersModule,
    AdminModule,
    AuthModule,
    CountryModule,
    CovidDataModule,
    ProjectModule,
    WorkplaceModule,
    CountryModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE_NAME: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
