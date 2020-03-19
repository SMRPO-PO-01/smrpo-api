import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(project?: VProject) {
    if (project) {
      this.title = project.title;
    }
  }
}
