import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Sprint } from '../sprint/sprint.entity';
import { ProjectToUser } from './project-to-user.entity';
import { VProject } from './project.validation';
import { Task } from '../task/task.entity';

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
    () => Task,
    task => task.project,
    { onDelete: 'CASCADE' },
  )
  tasks: Task[];

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
