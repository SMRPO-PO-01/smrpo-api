import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { StoryService } from '../story/story.service';
import { Sprint } from './sprint.entity';
import { VSprint } from './sprint.validation';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint) private sprintRepo: Repository<Sprint>,
    private storyService: StoryService,
  ) {}

  async getForProject(project: Project) {
    return await this.sprintRepo.find({ where: { project }, order: { startDate: 'DESC' } });
  }

  async getSprintById(id: number, project: Project) {
    const sprint = await this.sprintRepo.findOne(id, {
      where: { project },
      relations: ['stories'],
    });
    if (!sprint) {
      throw new NotFoundException(`Sprint with id ${id} not found!`);
    }
    return sprint;
  }

  async createSprint(data: VSprint) {
    await this.checkOverlapping(data);
    return await this.sprintRepo.save(new Sprint(data));
  }

  async addStoriesToSprint(sprintId: number, storyIds: number[], project: Project) {
    const sprint = await this.sprintRepo.findOne({
      where: { id: sprintId, projectId: project.id },
      relations: ['stories'],
    });
    if (!sprint) {
      throw new NotFoundException(`Sprint with id ${sprint.id} not found!`);
    }

    if (!sprint.isActive()) {
      throw new BadRequestException('Stories can be only added to active sprint.');
    }

    const stories = await this.storyService.findByIds(storyIds);

    if (stories.some(story => story.projectId !== project.id)) {
      throw new ForbiddenException(`Cannot add stories from other projects.`);
    }

    if (stories.some(story => sprint.stories.map(s => s.id).includes(story.id))) {
      throw new BadRequestException('One or more stories is already in this sprint.');
    }

    if (stories.some(story => !story.size)) {
      throw new BadRequestException(`All stories need to have size.`);
    }

    if (stories.some(story => story.accepted)) {
      throw new BadRequestException('Cannot add already accepted stories to sprint.');
    }

    sprint.stories.push(...stories);

    return await this.sprintRepo.save(sprint);
  }

  async updateSprint(data: { id: number } & VSprint) {
    await Promise.all([
      this.checkExistsAndNotActive(data.id, data.project.id),
      this.checkOverlapping(data),
    ]);

    return await this.sprintRepo.save(data);
  }

  async deleteSprint(id: number, project: Project) {
    await this.checkExistsAndNotActive(id, project.id);
    return await this.sprintRepo.delete(id);
  }

  private async checkExistsAndNotActive(id: number, projectId: number) {
    const sprint = await this.sprintRepo.findOne({ id: id, projectId: projectId });
    if (!sprint) {
      throw new NotFoundException(`Sprint with id ${id} doesn't exist.`);
    }
    if (sprint.isActive()) {
      throw new ConflictException(`Cannot edit an active sprint.`);
    }
  }

  private async checkOverlapping(data: { id?: number } & VSprint) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate < startDate || endDate < new Date()) {
      throw new ConflictException(`End date should be after the start date and after today.`);
    }
    const sprint = await this.sprintRepo.findOne({
      projectId: data.project.id,
      endDate: MoreThanOrEqual(data.startDate),
      startDate: LessThanOrEqual(data.endDate),
    });
    if (sprint && data.id !== sprint.id) {
      throw new ConflictException('Sprint overlaps with one or more existing sprints');
    }
  }
}
