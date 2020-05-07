import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';
import { Story } from '../story/story.entity';
import { VSprint } from './sprint.validation';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column()
  velocity: number;

  @Column()
  projectId: number;
  @ManyToOne(
    () => Project,
    p => p.sprints,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  project: Project;

  @ManyToMany(
    () => Story,
    s => s.sprints,
  )
  @JoinTable()
  stories: Story[];

  isActive() {
    const today = new Date();
    const endDate = new Date(this.endDate);
    endDate.setDate(endDate.getDate() + 1);

    return new Date(this.startDate) <= today && endDate > today;
  }

  constructor(data?: VSprint) {
    if (data) {
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.velocity = data.velocity;
      this.project = data.project;
    }
  }
}
