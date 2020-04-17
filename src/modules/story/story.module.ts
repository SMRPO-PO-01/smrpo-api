import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { StoryController } from './story.controller';
import { Story } from './story.entity';
import { StoryService } from './story.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), ProjectModule],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
