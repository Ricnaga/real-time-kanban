import { StatisticsController } from '@/backend/modules/statistics/controllers/statistics.controller';
import container from '@/backend/shared/container';
import type { BoardStatisticsModel } from './statistics.model';

export class StatisticsConnector {
  private readonly controller: StatisticsController;

  constructor() {
    this.controller = container.get(StatisticsController);
  }

  async getBoardStats(): Promise<BoardStatisticsModel> {
    return this.controller.getBoardStats();
  }
}
