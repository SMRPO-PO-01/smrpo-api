import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Sprint } from './sprint.entity';
import { VSprint } from './sprint.validation';

@Injectable()
export class SprintService {
  constructor(@InjectRepository(Sprint) private sprintRepo: Repository<Sprint>) {}

  async createSprint(data: VSprint) {
    await this.checkOverlaping(data);
    return await this.sprintRepo.save(new Sprint(data));
  }

  private async checkOverlaping(data: VSprint) {
    if (
      await this.sprintRepo.findOne({
        projectId: data.projectId,
        endDate: MoreThanOrEqual(data.startDate),
        startDate: LessThanOrEqual(data.endDate),
      })
    ) {
      throw new ConflictException('Sprint overlaps with one or more existing sprints');
    }
  }
}
