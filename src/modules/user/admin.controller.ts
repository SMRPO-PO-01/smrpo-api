import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../../guards/admin.guard';
import { Pagination } from '../../validators/pagination';
import { DUser } from './user.dto';
import { UserService } from './user.service';
import { VUser, VUserOpt } from './user.validation';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private userService: UserService) {}

  @Get('users')
  async listAll(@Query() pagination: Pagination, @Query('search') search: string) {
    const [users, count] = await this.userService.listAll(pagination, search);
    return { users: users.map(user => new DUser(user)), count };
  }

  @Post('add-user')
  async getMe(@Body() data: VUser) {
    return new DUser(await this.userService.createUser(data));
  }

  @Put('edit-user/:id')
  async editUser(@Param('id', new ParseIntPipe()) id: number, @Body() data: VUserOpt) {
    return new DUser(await this.userService.editUser(id, data));
  }

  @Delete('delete-user/:id')
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    return new DUser(await this.userService.deleteUser(id));
  }
}
