import { Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from 'src/services/project.service';

@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
}
