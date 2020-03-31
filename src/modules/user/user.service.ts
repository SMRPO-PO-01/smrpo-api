import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ILike } from '../../utils/ilike';
import { Pagination } from '../../validators/pagination';
import { User } from './user.entity';
import { VUser } from './user.validation';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async listAll({ skip, take }: Pagination, search: string) {
    return await this.userRepo.find({
      skip,
      take,
      order: { id: 'ASC' },
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { username: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
    });
  }

  async createUser(data: VUser) {
    if (await this.userRepo.findOne({ username: data.username })) {
      throw new ConflictException(`User with username ${data.username} already exists.`);
    }

    return await this.userRepo.save(new User(data));
  }

  async findByIds(ids: number[]) {
    return await this.userRepo.findByIds(ids);
  }
}
