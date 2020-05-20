import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { hash } from '../../../utils/hash';
import { User } from '../user.entity';
import { VLogin } from '../user.validation';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login({ username, password }: VLogin) {
    const user = await this.userRepo.findOne({ username, deleted: false });

    if (!user) {
      throw new NotFoundException(`User ${username} not found.`);
    } else if (user.password !== hash(user.salt + password)) {
      throw new BadRequestException('Wrong password');
    } else {
      user.lastLoginTime = user.currentLoginTime;
      user.currentLoginTime = new Date();
      return {
        user: await this.userRepo.save(user),
        token: this.jwtService.sign({
          username: user.username,
          password: user.password,
        }),
      };
    }
  }
}
