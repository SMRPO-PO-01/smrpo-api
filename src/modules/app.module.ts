import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ProjectModule, SprintModule],
})
export class AppModule {}
