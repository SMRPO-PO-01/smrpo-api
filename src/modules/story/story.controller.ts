import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { TASK_STATE } from '../task/task-state.enum';
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
    const story = await this.storyService.findById(data.id, project.id);
    if (!story) {
      throw new NotFoundException(`Story with id ${story.id} not found!`);
    }

    if (data.size && user.id !== story.project.scrumMaster.id) {
      throw new ForbiddenException(`Only scrum master can change the size of the story`);
    }

    if (data.reject && story.project.projectOwner.id === user.id) {
      return new DStory(await this.storyService.rejectStory(data, story));
    }

    const currentSprint = story.sprints.find(sprint => sprint.isActive());
    if (
      currentSprint &&
      !(
        (data.accepted || data.acceptanceComments) &&
        story.project.projectOwner.id === user.id &&
        story.tasks.every(task => task.state === TASK_STATE.DONE)
      )
    ) {
      throw new ConflictException(
        `Story in an active sprint cannot be edited. Only story in an active sprint with all tasks completed can have acceptance edited by project owner`,
      );
    }

    if (!currentSprint && (data.accepted || data.acceptanceComments)) {
      throw new ConflictException(`Only stories in an active sprint can have acceptance edited`);
    }

    return new DStory(await this.storyService.updateStory(data));
  }

  @Delete(':id')
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.PROJECT_OWNER)
  async deleteStory(@Param('id', new ParseIntPipe()) id: number, @PTUProject() project: Project) {
    const story = await this.storyService.findById(id, project.id);
    if (!story) {
      throw new NotFoundException(`Story with id ${id} not found.`);
    }
    if (story.tasks.every(task => task.state === TASK_STATE.DONE)) {
      throw new ConflictException(`Completed story cannot be deleted.`);
    }

    const currentSprint = story.sprints.find(sprint => sprint.isActive());
    if (currentSprint) {
      throw new ConflictException(`Story in an active sprint cannot be deleted.`);
    }

    return await this.storyService.deleteStory(id);
  }
}
