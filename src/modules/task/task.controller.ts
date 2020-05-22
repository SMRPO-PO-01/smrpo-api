import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PROJECT_USER_ROLE,
  PTUProject,
  PTURoles,
  PTURolesGuard,
} from '../../guards/ptu-roles.guard';
import { OptionalParseIntPipe } from '../../validators/integer';
import { Pagination } from '../../validators/pagination';
import { DefaultStringPipe } from '../../validators/string';
import { Project } from '../project/project.entity';
import { DTask } from './task.dto';
import { TaskService } from './task.service';
import { VTask, VTaskOpt } from './task.validation';
import { TASK_STATE } from './task-state.enum';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';

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
  async updateTask(@Body() data: VTaskOpt, @PTUProject() project: Project, @AuthUser() user: User) {
    await this.checkTaskRolePermissions(data.id, project, user);

    if (data.state === TASK_STATE.UNASSIGNED) {
      data.userId = null;
    } else if (data.state) {
      if (!data.userId) {
        data.userId = user.id;
      }
      if (data.userId !== user.id) {
        throw new ConflictException(`You can only change state of your own tasks`);
      }
    }

    return new DTask(await this.taskService.updateTask(data));
  }

  @Delete(':id')
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.DEVELOPER)
  async deleteTask(
    @Param('id', new ParseIntPipe()) id: number,
    @PTUProject() project: Project,
    @AuthUser() user: User,
  ) {
    const task = await this.checkTaskRolePermissions(id, project, user);
    if (task.state !== TASK_STATE.UNASSIGNED) {
      throw new ConflictException(`Cannot delete already assigned tasks.`);
    }

    return await this.taskService.deleteTask(id);
  }

  private async checkTaskRolePermissions(id: number, project: Project, user: User) {
    const task = await this.taskService.findById(id, project.id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found in current project.`);
    }
    if (task.userId && project.scrumMaster.id !== user.id && task.userId !== user.id) {
      throw new ConflictException(`You can only edit your own tasks.`);
    }
    return task;
  }
}
