import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../../guards/admin.guard';
import { AuthUser } from './auth/jwt.strategy';
import { DUser } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { VUser } from './user.validation';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private userService: UserService) {}

  @Post('add-user')
  async getMe(@AuthUser() user: User, @Body() data: VUser) {
    return new DUser(await this.userService.createUser(data));
  }
}
