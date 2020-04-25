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

import {
  PROJECT_USER_ROLE,
  PTUProject,
  PTURoles,
  PTURolesGuard,
} from '../../guards/ptu-roles.guard';
import { Project } from '../project/project.entity';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';
import { DStory } from './story.dto';
import { StoryService } from './story.service';
import { VStory, VStoryOpt } from './story.validation';
import { TASK_STATE } from '../task/task-state.enum';

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

    const currentSprint = story.sprints.find(sprint => sprint.isActive());
    if (
      currentSprint &&
      !(
        data.accepted &&
        story.project.projectOwner.id === user.id &&
        story.tasks.every(task => task.state === TASK_STATE.DONE)
      )
    ) {
      throw new ConflictException(
        `Cannot update, only story assigned to an active sprint with all tasks completed can be accepted`,
      );
    }

    if (!currentSprint && data.accepted) {
      throw new ConflictException(`Only stories in an active sprint can be accepted`);
    }

    return new DStory(await this.storyService.updateStory(data));
  }
}
