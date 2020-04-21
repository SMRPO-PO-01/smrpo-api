import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { StoryModule } from './story/story.module';
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
        ],
      },
    ]),
    UserModule,
    ProjectModule,
    SprintModule,
    TaskModule,
    StoryModule,
  ],
})
export class AppModule {}
