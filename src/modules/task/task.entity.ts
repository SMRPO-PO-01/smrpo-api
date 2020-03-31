import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TASK_STATE } from './task-state.enum';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
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
    () => User,
    user => user.tasks,
    { nullable: true },
  )
  user: User;

  @Column({ nullable: true })
  userId: number;

  constructor(task?: VTask) {
    if (task) {
      this.title = task.title;
      this.description = task.description;
      this.state = task.state;
      this.projectId = task.projectId;
      this.userId = task.userId;
    }
  }
}
