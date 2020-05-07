import { TASK_STATE } from '../task/task-state.enum';
import { STORY_PRIORITY } from './story-priority.enum';
import { Story } from './story.entity';

export class DStory {
  id: number;
  title: string;
  description: string;
  acceptanceTests: string;
  priority: STORY_PRIORITY;
  businessValue: number;
  size: number;
  accepted: boolean;
  projectId: number;
  acceptanceComments: string;
  allTasksCompleted: boolean;

  constructor(story: Story) {
    this.id = story.id;
    this.title = story.title;
    this.description = story.description;
    this.acceptanceTests = story.acceptanceTests;
    this.priority = story.priority;
    this.businessValue = story.businessValue;
    this.size = story.size;
    this.accepted = story.accepted;
    this.projectId = story.projectId;
    this.acceptanceComments = story.acceptanceComments;

    if (story.tasks) {
      this.allTasksCompleted = story.tasks.reduce(
        (bool, task) => bool && task.state === TASK_STATE.DONE,
        true,
      );
    }
  }
}
