import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Sprint } from '../sprint/sprint.entity';
import { ProjectToUser } from './project-to-user.entity';
import { VProject } from './project.validation';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @OneToMany(
    () => ProjectToUser,
    ptu => ptu.project,
  )
  users: ProjectToUser[];

  @OneToMany(
    () => Sprint,
    s => s.project,
  )
  sprints: Sprint[];

  constructor(project?: VProject) {
    if (project) {
      this.title = project.title;
    }
  }
}
