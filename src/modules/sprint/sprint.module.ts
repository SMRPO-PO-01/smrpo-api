import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { SprintController } from './sprint.controller';
import { Sprint } from './sprint.entity';
import { SprintService } from './sprint.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint]), ProjectModule],
  controllers: [SprintController],
  providers: [SprintService],
})
export class SprintModule {}
