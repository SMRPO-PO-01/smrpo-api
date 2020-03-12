import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { USER_ROLE } from '../modules/user/user-role.enum';
import { User } from '../modules/user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: User = req.uest;

    if (!user || user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('This route is admin only.');
    }

    return true;
  }
}
