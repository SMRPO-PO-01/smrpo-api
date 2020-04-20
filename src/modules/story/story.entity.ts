import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';
import { STORY_PRIORITY } from './story-priority.enum';
import { VStory } from './story.validation';
import { Sprint } from '../sprint/sprint.entity';
import { Task } from '../task/task.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  acceptanceTests: string;

  @Column()
  priority: STORY_PRIORITY;

  @Column()
  businessValue: number;

  @Column({ nullable: true })
  size: number;

  @Column()
  projectId: number;
  @ManyToOne(
    () => Project,
    p => p.stories,
  )
  project: Project;

  @ManyToOne(
    () => Sprint,
    sprint => sprint.stories,
    { nullable: true },
  )
  sprint: Sprint;

  @Column({ nullable: true })
  sprintId: number;

  @OneToMany(
    () => Task,
    task => task.story,
  )
  tasks: Task[];

  constructor(data?: VStory) {
    if (data) {
      this.title = data.title;
      this.description = data.description;
      this.acceptanceTests = data.acceptanceTests;
      this.priority = data.priority;
      this.businessValue = data.businessValue;
      this.project = data.project;
      this.size = data.size;
      this.sprintId = data.sprintId;
    }
  }
}
