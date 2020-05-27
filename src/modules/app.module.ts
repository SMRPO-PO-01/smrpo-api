import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { StoryModule } from './story/story.module';
import { TaskTimeModule } from './task-time/task-time.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RouterModule.forRoutes([
      {
        path: 'project',
        module: ProjectModule,
        children: [
          {
            path: '/:projectId/sprint',
            module: SprintModule,
          },
          {
            path: '/:projectId/task',
            module: TaskModule,
          },
          {
            path: '/:projectId/story',
            module: StoryModule,
          },
          {
            path: '/:projectId/task-time',
            module: TaskTimeModule,
          },
        ],
      },
    ]),
    ScheduleModule.forRoot(),
    UserModule,
    ProjectModule,
    SprintModule,
    TaskModule,
    StoryModule,
    TaskTimeModule,
  ],
})
export class AppModule {}
