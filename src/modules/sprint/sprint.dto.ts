import { DProject } from '../project/project.dto';
import { Sprint } from './sprint.entity';

export class DSprint {
  id: number;
  startDate: Date;
  endDate: Date;
  velocity: number;
  project: DProject;

  constructor(sprint: Sprint) {
    this.id = sprint.id;
    this.startDate = sprint.startDate;
    this.endDate = sprint.endDate;
    this.velocity = sprint.velocity;

    if (sprint.project) {
      this.project = new DProject(sprint.project);
    }
  }
}
