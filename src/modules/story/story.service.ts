import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { VStory, VStoryOpt } from './story.validation';

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private storyRepo: Repository<Story>) {}

  async createStory(data: VStory) {
    if (await this.storyRepo.findOne({ title: data.title, projectId: data.project.id })) {
      throw new ConflictException(`Story with title ${data.title} already exists`);
    }

    return await this.storyRepo.save(new Story(data));
  }

  async getStoriesForProject(projectId: number) {
    return await this.storyRepo.find({ where: { projectId }, order: { id: 'ASC' } });
  }

  async findById(id: number, projectId?: number) {
    const story: any = { id };
    if (projectId) {
      story.projectId = projectId;
    }
    return await this.storyRepo.findOne(story, {
      relations: [
        'project',
        'sprints',
        'tasks',
        'project.scrumMaster',
        'project.projectOwner',
        'project.developers',
      ],
    });
  }

  async findByIds(ids: number[]) {
    return await this.storyRepo.findByIds(ids);
  }

  async updateStory(data: VStoryOpt) {
    return await this.storyRepo.save(data);
  }

  async rejectStory(data: VStoryOpt, story: Story) {
    story.rejectReason = data.rejectReason;
    story.sprints = [];
    return await this.storyRepo.save(story);
  }

  async deleteStory(id: number) {
    return await this.storyRepo.delete(id);
  }
}
