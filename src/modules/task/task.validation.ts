import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { TASK_STATE } from './task-state.enum';

export class VTask {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(Object.values(TASK_STATE))
  state: TASK_STATE;

  @IsInt()
  projectId: number;

  @IsOptional()
  @IsInt()
  userId?: number;
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
  projectId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
