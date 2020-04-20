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
  sprintId: number;

  constructor(story: Story) {
    this.id = story.id;
    this.title = story.title;
    this.description = story.description;
    this.acceptanceTests = story.acceptanceTests;
    this.priority = story.priority;
    this.businessValue = story.businessValue;
    this.size = story.size;
    this.sprintId = story.sprintId;
  }
}
