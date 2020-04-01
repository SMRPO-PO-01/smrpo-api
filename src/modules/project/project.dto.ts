import { DUser } from '../user/user.dto';
import { PROJECT_USER_ROLE } from './project-user-role.enum';
import { Project } from './project.entity';

export class DProject {
  id: number;
  title: string;
  users: Array<DUser | { projectRole: PROJECT_USER_ROLE }>;

  constructor(project: Project) {
    this.id = project.id;
    this.title = project.title;

    if (project.users) {
      this.users = project.users.map(({ user, role, userId }) => ({
        ...(user ? new DUser(user) : { id: userId }),
        projectRole: role,
      }));
    }
  }
}
