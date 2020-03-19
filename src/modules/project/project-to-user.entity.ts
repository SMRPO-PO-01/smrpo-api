import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from '../user/user.entity';
import { PROJECT_USER_ROLE } from './project-user-role.enum';
import { Project } from './project.entity';

@Entity()
export class ProjectToUser {
  @Column()
  role: PROJECT_USER_ROLE;

  @Column({ primary: true })
  projectId: number;
  @ManyToOne(
    () => Project,
    project => project.users,
    { primary: true, onDelete: 'CASCADE' },
  )
  project: Project;

  @Column({ primary: true })
  userId: number;
  @ManyToOne(
    () => User,
    user => user.projects,
    { primary: true, onDelete: 'CASCADE' },
  )
  user: User;

  constructor(data?: {
    project: Project;
    user: User;
    role: PROJECT_USER_ROLE;
  }) {
    if (data) {
      this.project = data.project;
      this.user = data.user;
      this.role = data.role;
    }
  }
}
