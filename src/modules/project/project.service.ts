import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Like, Repository } from 'typeorm';

import { Pagination } from '../../validators/pagination';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectToUser } from './project-to-user.entity';
import { Project } from './project.entity';
import { VProject } from './project.validation';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(ProjectToUser) private ptuRepo: Repository<ProjectToUser>,
    private connection: Connection,
    private userService: UserService,
  ) {}

  async listAll({ skip, take }: Pagination, search: string) {
    return await this.projectRepo.find({
      order: { id: 'DESC' },
      take,
      skip,
      where: {
        title: Like(`%${search}%`),
      },
      relations: ['users', 'users.user'],
    });
  }

  async getMyProjects({ skip, take }: Pagination, search: string, user: User) {
    const projectsToUser = await this.ptuRepo.find({ userId: user.id });

    return await this.projectRepo.find({
      order: { id: 'DESC' },
      take,
      skip,
      where: {
        title: Like(`%${search}%`),
        id: In(projectsToUser.map(p => p.projectId)),
      },
      relations: ['users', 'users.user'],
    });
  }

  async createProject(data: VProject) {
    const users = await this.validateProjectDataAndGetUsers(data);

    /**
     * Transaction is used, because more than one atomic operation happens.
     * So if saving project succeeds, but saving projectUsers somehow fails,
     * the whole transaction is reverted (meaning successfully saved project is deleted from db)
     */
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let project, projectUsers;

    try {
      project = await queryRunner.manager.save(new Project(data));

      projectUsers = users.map(
        ({ user, role }) => new ProjectToUser({ project, user, role }),
      );

      await queryRunner.manager.save(projectUsers);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();

      return { ...project, users: projectUsers };
    }
  }

  private async validateProjectDataAndGetUsers(data: VProject) {
    if (await this.projectRepo.findOne({ title: data.title })) {
      throw new ConflictException(
        `Project with title ${data.title} already exists.`,
      );
    }

    const users = await this.userService.findByIds(data.users.map(u => u.id));

    for (const { id } of data.users) {
      if (users.every(u => u.id !== id)) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
    }

    return users.map(user => ({
      user,
      role: data.users.find(u => u.id === user.id).role,
    }));
  }
}
