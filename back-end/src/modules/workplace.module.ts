import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workplace } from 'src/models/workplace.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkplaceController } from 'src/controller/workplace.controller';
import { WorkplaceService } from 'src/services/workplace.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workplace]), AuthModule],
  controllers: [WorkplaceController],
  providers: [WorkplaceService],
})
export class WorkplaceModule {}
