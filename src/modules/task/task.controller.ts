import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTUProject, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { OptionalParseIntPipe } from '../../validators/integer';
import { Pagination } from '../../validators/pagination';
import { DefaultStringPipe } from '../../validators/string';
import { Project } from '../project/project.entity';
import { DTask } from './task.dto';
import { TaskService } from './task.service';
import { VTask, VTaskOpt } from './task.validation';

@Controller()
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @PTURoles(
    PROJECT_USER_ROLE.SCRUM_MASTER,
    PROJECT_USER_ROLE.PROJECT_OWNER,
    PROJECT_USER_ROLE.DEVELOPER,
  )
  async listAll(
    @Query() pagination: Pagination,
    @Query('search', new DefaultStringPipe()) search: string,
    @Query('user', new OptionalParseIntPipe()) user: number,
    @Query('story', new OptionalParseIntPipe()) story: number,
    @PTUProject() project: Project,
  ) {
    return (await this.taskService.listAll(pagination, search, user, project.id, story)).map(
      task => new DTask(task),
    );
  }

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.DEVELOPER)
  async createTask(@Body() data: VTask, @PTUProject() project: Project) {
    data.project = project;
    return new DTask(await this.taskService.createTask(data));
  }

  @Put()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.DEVELOPER)
  async updateTask(@Body() data: VTaskOpt, @PTUProject() project: Project) {
    return new DTask(await this.taskService.updateTask(data, project));
  }

  @Delete()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.DEVELOPER)
  async deleteTask(@Body() data: VTaskOpt, @PTUProject() project: Project) {
    return await this.taskService.deleteTask(data, project);
  }
}
