import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class TaskTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column({ default: 0 })
  time: number;

  @Column({ type: 'timestamptz', nullable: true })
  startedWorking: Date;

  @Column()
  taskId: number;
  @ManyToOne(
    () => Task,
    t => t.taskTimes,
    { onDelete: 'CASCADE' },
  )
  task: Task;

  @Column()
  userId: number;
  @ManyToOne(
    () => User,
    u => u.taskTimes,
    { onDelete: 'CASCADE' },
  )
  user: User;

  constructor(data?: { date: Date; task: Task; user: User }) {
    if (data) {
      this.date = data.date;
      this.task = data.task;
      this.user = data.user;
    }
  }
}
