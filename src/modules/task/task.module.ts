import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { StoryModule } from '../story/story.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectModule, StoryModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
