import { Allow, IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

import { Project } from '../project/project.entity';
import { STORY_PRIORITY } from './story-priority.enum';

export class VStory {
  @IsInt()
  projectId: number;

  // this is added by ptu-roles guard
  @Allow()
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
}
