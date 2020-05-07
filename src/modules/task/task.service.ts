import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';
import { Project } from '../project/project.entity';
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

  async findById(id: number) {
    return await this.taskRepo.findOne(id);
  }

  async createTask(data: VTask) {
    if (!(await this.storyService.findById(data.storyId))) {
      throw new BadRequestException(`Story with id ${data.storyId} does not exist.`);
    }
    return await this.taskRepo.save(new Task(data));
  }

  async updateTask(data: VTaskOpt, project: Project) {
    if (!(await this.taskRepo.findOne({ id: data.id, projectId: project.id }))) {
      throw new NotFoundException(`Task with id ${data.id} not found!`);
    }
    return await this.taskRepo.save(data);
  }

  async deleteTask(id: number, project: Project) {
    if (!(await this.taskRepo.findOne({ id: id, projectId: project.id }))) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
    return await this.taskRepo.delete(id);
  }
}
