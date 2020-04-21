import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTUProject, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { Project } from '../project/project.entity';
import { DSprint } from './sprint.dto';
import { SprintService } from './sprint.service';
import { VSprint } from './sprint.validation';

@Controller()
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER)
  async createSprint(@Body() data: VSprint, @PTUProject() project: Project) {
    data.project = project;
    return new DSprint(await this.sprintService.createSprint(data));
  }
}
