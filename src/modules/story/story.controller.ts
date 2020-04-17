import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { DStory } from './story.dto';
import { StoryService } from './story.service';
import { VStory } from './story.validation';

@Controller('story')
@UseGuards(AuthGuard('jwt'), PTURolesGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post()
  @PTURoles(PROJECT_USER_ROLE.SCRUM_MASTER, PROJECT_USER_ROLE.PROJECT_OWNER)
  async createStory(@Body() data: VStory) {
    return new DStory(await this.storyService.createStory(data));
  }
}
