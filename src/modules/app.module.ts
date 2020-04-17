import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { UserModule } from './user/user.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ProjectModule, SprintModule, TaskModule, StoryModule],
})
export class AppModule {}
