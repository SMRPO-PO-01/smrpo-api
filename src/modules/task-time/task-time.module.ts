import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { TaskTimeController } from './task-time.controller';
import { TaskTime } from './task-time.entity';
import { TaskTimeService } from './task-time.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTime]), ProjectModule, TaskModule],
  controllers: [TaskTimeController],
  providers: [TaskTimeService],
})
export class TaskTimeModule {}
