import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { DSprint } from './sprint.dto';
import { SprintService } from './sprint.service';
import { VSprint } from './sprint.validation';

@Controller('sprint')
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER)
  async createSprint(@Body() data: VSprint) {
    return new DSprint(await this.sprintService.createSprint(data));
  }
}
