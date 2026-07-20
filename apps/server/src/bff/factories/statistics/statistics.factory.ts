import { statisticsAdapter } from '@/bff/adapters';
import { StatisticsConnector } from '@/bff/connectors';

export function createStatisticsAdapter() {
  const connector = new StatisticsConnector();
  return statisticsAdapter(connector);
}
