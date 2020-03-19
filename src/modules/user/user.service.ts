import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { VUser } from './user.validation';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: VUser) {
    if (await this.userRepo.findOne({ username: data.username })) {
      throw new ConflictException(
        `User with username ${data.username} already exists.`,
      );
    }

    return await this.userRepo.save(new User(data));
  }
}
