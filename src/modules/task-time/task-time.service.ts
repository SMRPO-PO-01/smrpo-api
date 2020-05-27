import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { TaskService } from '../task/task.service';
import { User } from '../user/user.entity';
import { TaskTime } from './task-time.entity';

@Injectable()
export class TaskTimeService {
  constructor(
    @InjectRepository(TaskTime) private taskTimeRepo: Repository<TaskTime>,
    private taskService: TaskService,
  ) {}

  async startTaskTime(task: Task, user: User) {
    const taskTime = await this.findOrCreateTaskTime(new Date(), task, user);

    taskTime.startedWorking = new Date();

    return await this.taskTimeRepo.save(taskTime);
  }

  async endTaskTime(task: Task, user: User) {
    const taskTime = await this.taskTimeRepo.findOne({
      date: new Date(),
      taskId: task.id,
      userId: user.id,
    });

    if (!taskTime) {
      throw new NotFoundException('TaskTime not found!');
    }

    const time = new Date().getTime() - new Date(taskTime.startedWorking).getTime();
    taskTime.startedWorking = null;
    taskTime.time += Math.round(time / 60000);

    return await this.taskTimeRepo.save(taskTime);
  }

  async getAllForTask(task: Task) {
    return await this.taskTimeRepo.find({ taskId: task.id });
  }

  private async findOrCreateTaskTime(date: Date, task: Task, user: User) {
    return (
      (await this.taskTimeRepo.findOne({ date, taskId: task.id, userId: user.id })) ||
      new TaskTime({ date, task, user })
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async endStartedTasks() {
    console.log("CronJob 'endStartedTasks' started");
    const now = new Date();

    await this.taskService.changeActiveToAssigned();

    const taskTimes = await this.taskTimeRepo.find({ startedWorking: Not(IsNull()) });

    console.log(taskTimes);

    for (const tt of taskTimes) {
      tt.time += Math.round((now.getTime() - new Date(tt.startedWorking).getTime()) / 60000);
      tt.startedWorking = null;
    }

    await this.taskTimeRepo.save(taskTimes);

    console.log(
      "CronJob 'endStartedTasks' finished in:",
      new Date().getTime() - now.getTime(),
      'ms',
    );
  }
}
