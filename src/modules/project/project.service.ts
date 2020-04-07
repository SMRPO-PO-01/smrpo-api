import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Project } from './project.entity';
import { VProject } from './project.validation';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private userService: UserService,
  ) {}

  async listAll({ skip, take }: Pagination, search: string) {
    return await this.projectRepo.find({
      order: { id: 'DESC' },
      take,
      skip,
      where: {
        title: ILike(`%${search}%`),
      },
      relations: ['users', 'users.user'],
    });
  }

  async getMyProjects(user: User) {
    return await this.userService.usersProjects(user.id);
  }

  async createProject(data: VProject) {
    const users = await this.validateProjectDataAndGetUsers(data);

    const project = new Project({ ...data, ...users });
    return await this.projectRepo.save(project);
  }

  async findById(id: number, options?: FindOneOptions<Project>) {
    const project = await this.projectRepo.findOne(id, options);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found.`);
    }
    return project;
  }

  private async validateProjectDataAndGetUsers(data: VProject) {
    if (await this.projectRepo.findOne({ title: data.title })) {
      throw new ConflictException(`Project with title ${data.title} already exists.`);
    }

    const scrumMaster = await this.userService.findById(data.scrumMasterId);
    const projectOwner = await this.userService.findById(data.projectOwnerId);

    const developers = await this.userService.findByIds(data.developers);

    for (const id of data.developers) {
      if (developers.every(u => u.id !== id)) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
    }

    return { developers, scrumMaster, projectOwner };
  }
}
