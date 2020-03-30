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
  @IsNotEmpty()
  projectId: number;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userId?: number;
}

export class VTaskOpt {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsIn(Object.values(TASK_STATE))
  state?: TASK_STATE;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  projectId?: number;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userId?: number;
}
