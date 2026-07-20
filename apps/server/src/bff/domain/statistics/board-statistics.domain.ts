import type { BoardStatisticsModel } from '../../connectors/statistics/statistics.model';
import { ColumnStatsDomain } from './statistics.domain';

export class BoardStatisticsDomain {
  readonly columns: ColumnStatsDomain[];
  readonly totalTasks: number;

  constructor(model: BoardStatisticsModel) {
    this.columns = model.columns.map((col) => ColumnStatsDomain.fromModel(col));
    this.totalTasks = model.totalTasks;
  }

  static fromModel(model: BoardStatisticsModel): BoardStatisticsDomain {
    return new BoardStatisticsDomain(model);
  }
}
