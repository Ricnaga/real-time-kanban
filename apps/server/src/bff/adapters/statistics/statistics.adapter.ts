import { StatisticsConnector } from '@/bff/connectors';
import { BoardStatisticsDomain } from '@/bff/domain/statistics';
import type { IStatisticsPort } from './statistics-port';

export function statisticsAdapter(
  connector: StatisticsConnector,
): IStatisticsPort {
  return {
    getBoardStats: async () => {
      const model = await connector.getBoardStats();
      return BoardStatisticsDomain.fromModel(model);
    },
  };
}
