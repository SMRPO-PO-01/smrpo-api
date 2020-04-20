import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PROJECT_USER_ROLE, PTURoles, PTURolesGuard } from '../../guards/ptu-roles.guard';
import { DStory } from './story.dto';
import { StoryService } from './story.service';
import { VStory, VStoryOpt } from './story.validation';
import { AuthUser } from '../user/auth/jwt.strategy';
import { User } from '../user/user.entity';
import { USER_ROLE } from '../user/user-role.enum';

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
  async updateStory(@Body() data: VStoryOpt, @AuthUser() user: User) {
    let story = await this.storyService.findById(data.id);
    if (user.role !== USER_ROLE.ADMIN) {
      if (
        ![
          story.project.projectOwner.id,
          story.project.scrumMaster.id,
          ...story.project.developers.map(d => d.id),
        ].includes(user.id)
      ) {
        throw new ForbiddenException(
          `This route can only be used by scrum master, project owner and developers`,
        );
      }
      if (data.size && user.id !== story.project.scrumMaster.id) {
        throw new ForbiddenException(
          `Only admin and scrum master can change the size of the story`,
        );
      }
    }
    if (data.size && story.sprintId) {
      throw new ConflictException(
        `Cannot change size, the story is already assigned to sprint ${story.sprintId}`,
      );
    }
    return new DStory(await this.storyService.updateStory(data));
  }
}
