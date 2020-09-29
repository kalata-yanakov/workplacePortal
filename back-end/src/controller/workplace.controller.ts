import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkplaceService } from 'src/services/workplace.service';

@Controller('/api/workplace')
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}
}
