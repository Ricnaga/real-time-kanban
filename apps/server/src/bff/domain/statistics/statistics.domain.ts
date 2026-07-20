import type { ColumnStatsModel } from '../../connectors/statistics/statistics.model';
import { BaseDomain } from '../base.domain';

export class ColumnStatsDomain extends BaseDomain {
  static readonly __typename: string = 'ColumnStats';

  readonly id: string;
  readonly title: string;
  readonly step: string;
  readonly taskCount: number;

  constructor(model: ColumnStatsModel) {
    super();
    this.id = ColumnStatsDomain.uuidToRelay(model.id);
    this.title = model.title;
    this.step = model.step;
    this.taskCount = model.taskCount;
  }

  static fromModel(model: ColumnStatsModel): ColumnStatsDomain {
    return new ColumnStatsDomain(model);
  }
}
