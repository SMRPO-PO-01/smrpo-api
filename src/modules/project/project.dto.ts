import { DStory } from '../story/story.dto';
import { DUser } from '../user/user.dto';
import { Project } from './project.entity';

export class DProject {
  id: number;
  title: string;
  scrumMaster: DUser;
  projectOwner: DUser;
  developers: Array<DUser>;

  constructor(project: Project) {
    this.id = project.id;
    this.title = project.title;

    if (project.scrumMaster) {
      this.scrumMaster = new DUser(project.scrumMaster);
    }

    if (project.projectOwner) {
      this.projectOwner = new DUser(project.projectOwner);
    }

    if (project.developers) {
      this.developers = project.developers.map(dev => new DUser(dev));
    }
  }
}

export class DProjectWithStories extends DProject {
  backlog: DStory[];
  sprint: DStory[];
  accepted: DStory[];

  constructor(project: Project) {
    super(project);

    const activeSprint = project.sprints.find(sprint => sprint.isActive());
    if (activeSprint) {
      this.sprint = activeSprint.stories.map(story => new DStory(story));
    }

    this.backlog = project.stories.filter(
      story => !this.sprint || !this.sprint.some(st => st.id === story.id),
    );

    this.accepted = []; //TODO:
  }
}
