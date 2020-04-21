import { Transform } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

import { MinDateFun } from '../../utils/min-date.validator';
import { Project } from '../project/project.entity';

export class VSprint {
  project: Project;

  @IsDate({
    message: args => `${args.property} must be valid javascript string representation of Date`,
  })
  @MinDateFun(() => new Date())
  @Transform(str => new Date(str))
  startDate: Date;

  @IsDate({
    message: args => `${args.property} must be valid javascript string representation of Date`,
  })
  @MinDateFun(o => o.startDate)
  @Transform(str => new Date(str))
  endDate: Date;

  @IsInt()
  @Min(1)
  velocity: number;
}
