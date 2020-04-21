import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTUProject, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { Project } from '../project/project.entity';
import { DSprint } from './sprint.dto';
import { SprintService } from './sprint.service';
import { VSprint, VStories } from './sprint.validation';

@Controller()
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Get()
  @PTURoles(
    PROJECT_USER_ROLE.SCRUM_MASTER,
    PROJECT_USER_ROLE.PROJECT_OWNER,
    PROJECT_USER_ROLE.DEVELOPER,
  )
  async getSprints(@PTUProject() project: Project) {
    return await this.sprintService
      .getForProject(project)
      .then(sprints => sprints.map(sprint => new DSprint(sprint)));
  }

  @Get(':id')
  @PTURoles(
    PROJECT_USER_ROLE.SCRUM_MASTER,
    PROJECT_USER_ROLE.PROJECT_OWNER,
    PROJECT_USER_ROLE.DEVELOPER,
  )
  async getSprint(@PTUProject() project: Project, @Param('id', new ParseIntPipe()) id: number) {
    return new DSprint(await this.sprintService.getSprintById(id, project));
  }

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER)
  async createSprint(@Body() data: VSprint, @PTUProject() project: Project) {
    data.project = project;
    return new DSprint(await this.sprintService.createSprint(data));
  }

  @Put('add-stories')
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER)
  async addStoriesToSprint(
    @Body() { stories, sprintId }: VStories,
    @PTUProject() project: Project,
  ) {
    return new DSprint(await this.sprintService.addStoriesToSprint(sprintId, stories, project));
  }
}
