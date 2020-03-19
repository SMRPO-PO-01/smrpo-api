import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PROJECT_USER_ROLE } from './project-user-role.enum';

class VProjectUser {
  @IsInt()
  id: number;

  @IsIn(Object.values(PROJECT_USER_ROLE))
  role: PROJECT_USER_ROLE;
}

export class VProject {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => VProjectUser)
  users: VProjectUser[];
}
