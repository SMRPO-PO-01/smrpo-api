import { DProject } from '../project/project.dto';
import { DStory } from '../story/story.dto';
import { Sprint } from './sprint.entity';

export class DSprint {
  id: number;
  startDate: Date;
  endDate: Date;
  velocity: number;
  project: DProject;
  stories: DStory[];

  constructor(sprint: Sprint) {
    this.id = sprint.id;
    this.startDate = sprint.startDate;
    this.endDate = sprint.endDate;
    this.velocity = sprint.velocity;

    if (sprint.project) {
      this.project = new DProject(sprint.project);
    }

    if (sprint.stories) {
      this.stories = sprint.stories.map(story => new DStory(story));
    }
  }
}
