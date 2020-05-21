import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { Pagination } from '../../validators/pagination';
import { AuthUser } from './auth/jwt.strategy';
import { DUser } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { VUser, VUserSelf } from './user.validation';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Get('me')
  async getMe(@AuthUser() user: User) {
    return new DUser(user);
  }

  @Get('list-all')
  async listAll(@Query() pagination: Pagination, @Query('search') search: string) {
    const [users, count] = await this.userService.listAll(pagination, search);
    return { users: users.map(user => new DUser(user)), count };
  }

  @Put('me')
  async updateMe(@AuthUser() { id }: User, @Body() data: VUserSelf) {
    const user = await this.userService.editUser(id, data as VUser);
    return new DUser(
      user,
      this.jwtService.sign({
        username: user.username,
        password: user.password,
      }),
    );
  }
}
