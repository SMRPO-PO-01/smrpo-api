import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PROJECT_USER_ROLE } from '../modules/project/project-user-role.enum';
import { ProjectService } from '../modules/project/project.service';
import { User } from '../modules/user/user.entity';

@Injectable()
export class PTURolesGuard implements CanActivate {
  constructor(private projectService: ProjectService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const body = request.body;
    const roles = this.reflector.get<PROJECT_USER_ROLE[]>('ptu-roles', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    } else if (!body.hasOwnProperty('projectId')) {
      console.warn(
        '\n\x1b[33mPTURolesGuard has no effect if projectId field is not part of body!\n\x1b[0m',
      );
      return true;
    }

    const project = await this.projectService.findById(body.projectId);

    body.project = project;

    if (project.users.some(pu => pu.userId === user.id && roles.includes(pu.role))) {
      return true;
    } else {
      throw new ForbiddenException(
        `This route can only be used by users with project roles: ${roles.join(', ')}`,
      );
    }
  }
}

export const PTURoles = (...roles: PROJECT_USER_ROLE[]) => SetMetadata('ptu-roles', roles);
