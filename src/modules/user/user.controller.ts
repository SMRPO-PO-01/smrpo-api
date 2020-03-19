import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthUser } from './auth/jwt.strategy';
import { DUser } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@AuthUser() user: User) {
    return new DUser(user);
  }
}
