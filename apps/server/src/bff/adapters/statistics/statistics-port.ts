import type { BoardStatisticsDomain } from '../../domain/statistics';

export interface IStatisticsPort {
  getBoardStats(): Promise<BoardStatisticsDomain>;
}
