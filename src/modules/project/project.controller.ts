import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../../guards/admin.guard';
import { PROJECT_USER_ROLE, PTUProject, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { Pagination } from '../../validators/pagination';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';
import { DProject, DProjectWithStories } from './project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { VProject } from './project.validation';

@Controller()
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('create')
  @UseGuards(AdminGuard)
  async createProject(@Body() data: VProject) {
    return new DProject(await this.projectService.createProject(data));
  }

  @Put(':projectId')
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.ADMIN)
  async editProject(@Body() data: VProject, @PTUProject() project: Project) {
    return new DProject(await this.projectService.editProject(project, data));
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async listAll(@Query() pagination: Pagination, @Query('search') search: string) {
    const [projects, count] = await this.projectService.listAll(pagination, search);
    return { projects: projects.map(project => new DProject(project)), count };
  }

  @Get('my')
  async getMyProjects(@AuthUser() user: User) {
    return (await this.projectService.getMyProjects(user)).map(project => new DProject(project));
  }

  @Get(':id')
  async getOneProject(@AuthUser() user: User, @Param('id', new ParseIntPipe()) id: number) {
    return new DProjectWithStories(await this.projectService.getOneProjectWithStories(id, user));
  }
}
