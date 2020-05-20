import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { AuthUser } from './auth/jwt.strategy';
import { DUser } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { VUser } from './user.validation';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Get('me')
  async getMe(@AuthUser() user: User) {
    return new DUser(user);
  }

  @Put('me')
  async updateMe(@AuthUser() { id }: User, @Body() data: VUser) {
    const user = await this.userService.editUser(id, data);
    return new DUser(
      user,
      this.jwtService.sign({
        username: user.username,
        password: user.password,
      }),
    );
  }
}
