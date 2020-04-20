import { Body, Controller, Get, Post, Query, UseGuards, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { Pagination } from '../../validators/pagination';
import { DTask } from './task.dto';
import { VTask, VTaskOpt } from './task.validation';
import { OptionalParseIntPipe } from '../../validators/integer';
import { DefaultStringPipe } from '../../validators/string';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(['', 'all'])
  async listAll(
    @Query() pagination: Pagination,
    @Query('search', new DefaultStringPipe()) search: string,
    @Query('user', new OptionalParseIntPipe()) user: number,
    @Query('project', new OptionalParseIntPipe()) project: number,
    @Query('story', new OptionalParseIntPipe()) story: number,
  ) {
    return (await this.taskService.listAll(pagination, search, user, project, story)).map(
      task => new DTask(task),
    );
  }

  @Post(['', 'create'])
  async createTask(@Body() data: VTask) {
    return new DTask(await this.taskService.createTask(data));
  }

  @Put(['', 'update'])
  async updateTask(@Body() data: VTaskOpt) {
    return new DTask(await this.taskService.updateTask(data));
  }

  @Delete(['', 'delete'])
  async deleteTask(@Body() data: VTaskOpt) {
    return await this.taskService.deleteTask(data);
  }
}
