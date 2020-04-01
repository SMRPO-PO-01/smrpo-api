import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';
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

  constructor(data?: VSprint) {
    if (data) {
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.velocity = data.velocity;
      this.project = data.project;
    }
  }
}
