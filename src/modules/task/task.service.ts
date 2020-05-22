import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';
import { Task } from './task.entity';
import { VTask, VTaskOpt } from './task.validation';
import { StoryService } from '../story/story.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private storyService: StoryService,
  ) {}

  async listAll(
    { skip, take }: Pagination,
    search: string,
    userId: number,
    projectId: number,
    storyId: number,
  ) {
    let where = [
      { title: ILike(`%${search}%`) },
      { description: ILike(`%${search}%`) },
      { state: ILike(`%${search}%`) },
    ];
    const filter: any = {};
    if (userId) {
      filter.userId = userId;
    }
    if (projectId) {
      filter.projectId = projectId;
    }
    if (storyId) {
      filter.storyId = storyId;
    }
    where = where.map(elem => ({
      ...elem,
      ...filter,
    }));
    return await this.taskRepo.find({
      order: { id: 'DESC' },
      skip,
      take,
      where,
    });
  }

  async findById(id: number, projectId?: number) {
    const task: any = { id };
    if (projectId) {
      task.projectId = projectId;
    }
    return await this.taskRepo.findOne(task);
  }

  async createTask(data: VTask) {
    const story = await this.storyService.findById(data.storyId);
    if (!story || story.projectId != data.project.id) {
      throw new BadRequestException(
        `Story with id ${data.storyId} does not exist in the current project.`,
      );
    }
    return await this.taskRepo.save(new Task(data));
  }

  async updateTask(data: VTaskOpt) {
    return await this.taskRepo.save(data);
  }

  async deleteTask(id: number) {
    return await this.taskRepo.delete(id);
  }
}
