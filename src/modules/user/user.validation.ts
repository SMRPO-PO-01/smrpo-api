import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

import { USER_ROLE } from './user-role.enum';

export class VUser {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsIn(Object.values(USER_ROLE))
  role: USER_ROLE;
}

export class VLogin {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
