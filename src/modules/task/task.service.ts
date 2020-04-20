import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { VTask, VTaskOpt } from './task.validation';
import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async findById(id: number) {
    return await this.taskRepo.findOne(id);
  }

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
    let filter: any = {};
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

  async createTask(data: VTask) {
    return await this.taskRepo.save(new Task(data));
  }

  async updateTask(data: VTaskOpt) {
    return await this.taskRepo.save(data);
  }

  async deleteTask(data: VTaskOpt) {
    return await this.taskRepo.delete(data);
  }
}
