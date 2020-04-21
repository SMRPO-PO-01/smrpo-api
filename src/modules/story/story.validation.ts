import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { Project } from '../project/project.entity';
import { STORY_PRIORITY } from './story-priority.enum';

export class VStory {
  project: Project;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  acceptanceTests: string;

  @IsIn(Object.values(STORY_PRIORITY))
  priority: STORY_PRIORITY;

  @IsInt()
  @Min(1)
  @Max(10)
  businessValue: number;

  @IsInt()
  @Min(1)
  @Max(15)
  @IsOptional()
  size: number;

  @IsOptional()
  @IsInt()
  sprintId?: number;
}

export class VStoryOpt {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  acceptanceTests?: string;

  @IsOptional()
  @IsIn(Object.values(STORY_PRIORITY))
  priority?: STORY_PRIORITY;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  businessValue?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  size?: number;

  @IsOptional()
  @IsInt()
  sprintId?: number;
}
