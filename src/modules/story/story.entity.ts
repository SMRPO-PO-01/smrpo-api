import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';
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

  @Column()
  projectId: number;
  @ManyToOne(
    () => Project,
    p => p.stories,
  )
  project: Project;

  constructor(data?: VStory) {
    if (data) {
      this.title = data.title;
      this.description = data.description;
      this.acceptanceTests = data.acceptanceTests;
      this.priority = data.priority;
      this.businessValue = data.businessValue;
      this.project = data.project;
    }
  }
}
