import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';
import { Sprint } from '../sprint/sprint.entity';
import { Task } from '../task/task.entity';
import { STORY_PRIORITY } from './story-priority.enum';
import { VStory } from './story.validation';

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

  @ManyToMany(
    () => Sprint,
    sprint => sprint.stories,
  )
  sprints: Sprint[];

  @OneToMany(
    () => Task,
    task => task.story,
  )
  tasks: Task[];

  @Column({ default: false })
  accepted: boolean;

  @Column({ type: 'text', default: '' })
  acceptanceComments: string;

  @Column({ type: 'text', default: '' })
  rejectReason: string;

  constructor(data?: VStory) {
    if (data) {
      this.title = data.title;
      this.description = data.description;
      this.acceptanceTests = data.acceptanceTests;
      this.priority = data.priority;
      this.businessValue = data.businessValue;
      this.project = data.project;
      this.size = data.size;
      this.accepted = data.accepted;
      this.acceptanceComments = data.acceptanceComments;
    }
  }
}
