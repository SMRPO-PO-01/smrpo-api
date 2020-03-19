import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../../guards/admin.guard';
import { Pagination } from '../../validators/pagination';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';
import { DProject } from './project.dto';
import { ProjectService } from './project.service';
import { VProject } from './project.validation';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('create')
  @UseGuards(AdminGuard)
  async createProject(@Body() data: VProject) {
    return new DProject(await this.projectService.createProject(data));
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async listAll(
    @Query() pagination: Pagination,
    @Query('search') search: string,
  ) {
    return (await this.projectService.listAll(pagination, search)).map(
      project => new DProject(project),
    );
  }

  @Get('my')
  async getMyProjects(
    @Query() pagination: Pagination,
    @Query('search') search: string,
    @AuthUser() user: User,
  ) {
    return (
      await this.projectService.getMyProjects(pagination, search, user)
    ).map(project => new DProject(project));
  }
}
