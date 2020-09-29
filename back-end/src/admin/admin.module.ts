import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FloorPlaning } from 'src/models/floorPlaning.entity';
import { Workplace } from 'src/models/workplace.entity';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
import { SingleDesk } from 'src/models/singleDesk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workplace, FloorPlaning, Project, User, SingleDesk]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
