import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Sprint } from '../sprint/sprint.entity';
import { Story } from '../story/story.entity';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @ManyToOne(
    () => User,
    u => u.projects_sm,
    { nullable: false, onDelete: 'CASCADE' },
  )
  scrumMaster: User;

  @ManyToOne(
    () => User,
    u => u.projects_po,
    { nullable: false, onDelete: 'CASCADE' },
  )
  projectOwner: User;

  @JoinTable()
  @ManyToMany(
    () => User,
    u => u.projects,
  )
  developers: User[];

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

  @OneToMany(
    () => Story,
    s => s.project,
  )
  stories: Story;

  constructor(project?: {
    title: string;
    developers: User[];
    scrumMaster: User;
    projectOwner: User;
  }) {
    if (project) {
      this.title = project.title;
      this.scrumMaster = project.scrumMaster;
      this.projectOwner = project.projectOwner;
      this.developers = project.developers;
    }
  }
}
