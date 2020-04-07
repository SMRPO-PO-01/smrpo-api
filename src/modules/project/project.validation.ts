import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VProject {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  scrumMasterId: number;

  @IsInt()
  projectOwnerId: number;

  @IsArray()
  @IsInt({ each: true })
  developers: number[];
}
