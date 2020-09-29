import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { AuthModule } from 'src/auth/auth.module';

import { Workplace } from 'src/models/workplace.entity';
import { Project } from 'src/models/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Workplace, Project]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService ],
})
export class UsersModule {}
