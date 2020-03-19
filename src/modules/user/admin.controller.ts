import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../../guards/admin.guard';
import { Pagination } from '../../validators/pagination';
import { DUser } from './user.dto';
import { UserService } from './user.service';
import { VUser } from './user.validation';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private userService: UserService) {}

  @Get('users')
  async listAll(
    @Query() pagination: Pagination,
    @Query('search') search: string,
  ) {
    return (await this.userService.listAll(pagination, search)).map(
      user => new DUser(user),
    );
  }

  @Post('add-user')
  async getMe(@Body() data: VUser) {
    return new DUser(await this.userService.createUser(data));
  }
}
