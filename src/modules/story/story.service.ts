import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { VStory, VStoryOpt } from './story.validation';

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private storyRepo: Repository<Story>) {}

  async createStory(data: VStory) {
    if (await this.storyRepo.findOne({ title: data.title, projectId: data.projectId })) {
      throw new ConflictException(`Story with title ${data.title} already exists`);
    }

    return await this.storyRepo.save(new Story(data));
  }

  async getStoriesForProject(projectId: number) {
    return await this.storyRepo.find({ where: { projectId }, order: { id: 'ASC' } });
  }

  async findById(id: number) {
    return await this.storyRepo.findOne(id, {
      relations: [
        'project',
        'sprint',
        'tasks',
        'project.scrumMaster',
        'project.projectOwner',
        'project.developers',
      ],
    });
  }

  async updateStory(data: VStoryOpt) {
    return await this.storyRepo.save(data);
  }
}
