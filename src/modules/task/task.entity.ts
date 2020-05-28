import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from '../project/project.entity';
import { Story } from '../story/story.entity';
import { TaskTime } from '../task-time/task-time.entity';
import { User } from '../user/user.entity';
import { TASK_STATE } from './task-state.enum';
import { VTask } from './task.validation';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  state: TASK_STATE;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Project,
    project => project.tasks,
  )
  project: Project;

  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(
    () => Story,
    story => story.tasks,
    { nullable: true, onDelete: 'CASCADE' },
  )
  story: Story;

  @Column({ nullable: true })
  storyId: number;

  @ManyToOne(
    () => User,
    user => user.tasks,
    { nullable: true },
  )
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  size: number;

  @OneToMany(
    () => TaskTime,
    tt => tt.task,
  )
  taskTimes: TaskTime[];

  constructor(task?: VTask) {
    if (task) {
      this.title = task.title;
      this.description = task.description;
      this.state = task.state;
      this.project = task.project;
      this.userId = task.userId;
      this.storyId = task.storyId;
      this.size = task.size;
    }
  }
}
