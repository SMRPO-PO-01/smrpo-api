import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { Project } from '../project/project.entity';
import { TASK_STATE } from './task-state.enum';

export class VTask {
  project: Project;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsIn(Object.values(TASK_STATE))
  state: TASK_STATE;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  storyId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  size?: number;
}

export class VTaskOpt {
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
  @IsIn(Object.values(TASK_STATE))
  state?: TASK_STATE;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  storyId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  size?: number;
}
