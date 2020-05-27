import { TASK_STATE } from './task-state.enum';
import { Task } from './task.entity';

export class DTask {
  id: number;
  title: string;
  description?: string;
  state: TASK_STATE;
  createdAt: Date;
  projectId: number;
  userId: number;
  storyId: number;
  size: number;
  time: number;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.state = task.state;
    this.createdAt = task.createdAt;
    this.projectId = task.projectId;
    this.userId = task.userId;
    this.storyId = task.storyId;
    this.size = task.size;

    if (task.taskTimes) {
      this.time = task.taskTimes.reduce((acc, tt) => acc + tt.time, 0);
    }
  }
}
