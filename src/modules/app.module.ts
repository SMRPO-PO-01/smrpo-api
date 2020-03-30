import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ProjectModule, TaskModule],
})
export class AppModule {}
