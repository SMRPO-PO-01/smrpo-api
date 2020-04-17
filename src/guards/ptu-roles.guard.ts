import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isNumber } from 'util';

import { ProjectService } from '../modules/project/project.service';
import { User } from '../modules/user/user.entity';

export enum PROJECT_USER_ROLE {
  PROJECT_OWNER = 'PROJECT_OWNER',
  SCRUM_MASTER = 'SCRUM_MASTER',
  DEVELOPER = 'DEVELOPER',
}

@Injectable()
export class PTURolesGuard implements CanActivate {
  constructor(private projectService: ProjectService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const body = request.body;
    const params = request.params;
    const roles = this.reflector.get<PROJECT_USER_ROLE[]>('ptu-roles', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    } else if (!body.hasOwnProperty('projectId') && !params.hasOwnProperty('projectId')) {
      console.warn(
        '\n\x1b[33mPTURolesGuard has no effect if projectId field is not part of body or params!\n\x1b[0m',
      );
      return true;
    }

    const projectId = body.projectId || +params.projectId;

    if (!isNumber(projectId)) {
      throw new ForbiddenException(
        `This route can only be used by users with project roles: ${roles.join(', ')}`,
      );
    }

    const project = await this.projectService.findById(projectId, {
      relations: ['developers', 'scrumMaster', 'projectOwner'],
    });

    body.project = project;

    if (
      (roles.includes(PROJECT_USER_ROLE.DEVELOPER) &&
        project.developers.some(dev => dev.id === user.id)) ||
      (roles.includes(PROJECT_USER_ROLE.PROJECT_OWNER) && project.projectOwner.id === user.id) ||
      (roles.includes(PROJECT_USER_ROLE.SCRUM_MASTER) && project.scrumMaster.id === user.id)
    ) {
      return true;
    } else {
      throw new ForbiddenException(
        `This route can only be used by users with project roles: ${roles.join(', ')}`,
      );
    }
  }
}

export const PTURoles = (...roles: PROJECT_USER_ROLE[]) => SetMetadata('ptu-roles', roles);
