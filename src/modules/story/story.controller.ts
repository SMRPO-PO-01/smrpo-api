import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTUProject, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { Project } from '../project/project.entity';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';
import { DStory } from './story.dto';
import { StoryService } from './story.service';
import { VStory, VStoryOpt } from './story.validation';

@Controller()
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.PROJECT_OWNER)
  async createStory(@Body() data: VStory, @PTUProject() project: Project, @AuthUser() user: User) {
    if (data.size && user.id !== project.scrumMaster.id) {
      throw new ForbiddenException(`Only scrum master can change the size of the story`);
    }
    data.project = project;
    return new DStory(await this.storyService.createStory(data));
  }

  @Get()
  @PTURoles(
    PROJECT_USER_ROLE.SCRUM_MASTER,
    PROJECT_USER_ROLE.PROJECT_OWNER,
    PROJECT_USER_ROLE.DEVELOPER,
  )
  async getStoriesForProject(@PTUProject() project: Project) {
    return await this.storyService
      .getStoriesForProject(project.id)
      .then(stories => stories.map(story => new DStory(story)));
  }

  @Put()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.PROJECT_OWNER)
  async updateStory(
    @Body() data: VStoryOpt,
    @AuthUser() user: User,
    @PTUProject() project: Project,
  ) {
    const story = await this.storyService.findById(data.id);
    if (!story || story.projectId !== project.id) {
      throw new NotFoundException(`Story with id ${story.id} not found!`);
    }

    if (data.size && user.id !== story.project.scrumMaster.id) {
      throw new ForbiddenException(`Only scrum master can change the size of the story`);
    }
    if (story.sprints.some(sprint => sprint.isActive())) {
      throw new ConflictException(`Cannot update, the story is already assigned to active sprint`);
    }
    return new DStory(await this.storyService.updateStory(data));
  }
}
