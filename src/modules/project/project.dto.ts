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
