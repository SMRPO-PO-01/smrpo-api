import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { DStory } from './story.dto';
import { StoryService } from './story.service';
import { VStory, VStoryOpt } from './story.validation';

@Controller('story')
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.PROJECT_OWNER)
  async createStory(@Body() data: VStory) {
    return new DStory(await this.storyService.createStory(data));
  }

  @Get(':projectId')
  @PTURoles(
    PROJECT_USER_ROLE.SCRUM_MASTER,
    PROJECT_USER_ROLE.PROJECT_OWNER,
    PROJECT_USER_ROLE.DEVELOPER,
  )
  async getStoriesForProject(@Param('projectId', new ParseIntPipe()) projectId: number) {
    return await this.storyService
      .getStoriesForProject(projectId)
      .then(stories => stories.map(story => new DStory(story)));
  }

  @Put()
  async updateStory(@Body() data: VStoryOpt) {
    return new DStory(await this.storyService.updateStory(data));
  }
}
