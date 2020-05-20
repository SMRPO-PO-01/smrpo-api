import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { hash } from '../../utils/hash';
import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';
import { User } from './user.entity';
import { VUser, VUserOpt } from './user.validation';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async listAll({ skip, take }: Pagination, search = '') {
    const searchArr = search.split(' ');

    return await this.userRepo.findAndCount({
      skip,
      take,
      order: { id: 'ASC' },
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { username: ILike(`%${search}%`) },
        ...(searchArr.length > 1
          ? [
              { firstName: ILike(`%${searchArr[0]}%`), lastName: ILike(`%${searchArr[1]}%`) },
              { firstName: ILike(`%${searchArr[1]}%`), lastName: ILike(`%${searchArr[0]}%`) },
            ]
          : []),
      ],
    });
  }

  async createUser(data: VUser) {
    if (await this.userRepo.findOne({ username: data.username })) {
      throw new ConflictException(`User with username ${data.username} already exists.`);
    }

    return await this.userRepo.save(new User(data));
  }

  async editUser(id: number, data: VUserOpt) {
    const user = await this.findById(id);

    if (
      data.username &&
      user.username !== data.username &&
      (await this.userRepo.findOne({ username: data.username }))
    ) {
      throw new ConflictException(`User with username ${data.username} already exists.`);
    }

    if (data.username) user.username = data.username;
    if (data.password) user.password = hash(user.salt + data.password);
    if (data.email) user.email = data.email;
    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (data.role) user.role = data.role;

    return await this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.findById(id);
    user.deleted = !user.deleted;

    return await this.userRepo.save(user);
  }

  async findByIds(ids: number[]) {
    return await this.userRepo.findByIds(ids);
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  async usersProjects(userId: number) {
    const user = await this.userRepo.findOne(userId, {
      relations: [
        'projects',
        'projects.developers',
        'projects.scrumMaster',
        'projects.projectOwner',
        'projects_sm',
        'projects_sm.developers',
        'projects_sm.scrumMaster',
        'projects_sm.projectOwner',
        'projects_po',
        'projects_po.developers',
        'projects_po.scrumMaster',
        'projects_po.projectOwner',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    return Array.from(
      new Map(
        [...user.projects_po, ...user.projects_sm, ...user.projects]
          .sort((a, b) => a.id - b.id)
          .map(x => [x.id, x]),
      ).values(),
    );
  }
}
