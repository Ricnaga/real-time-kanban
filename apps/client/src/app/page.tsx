import { getClient } from '@/services/urql-rsc';
import { GET_BOARD_STATISTICS } from '@/services/graphql/queries';
import { StatisticsDashboard } from './_components/statistics-dashboard/statistics-dashboard';

export default async function StatisticsPage() {
  const client = getClient();
  const result = await client.query(GET_BOARD_STATISTICS, {});

  return (
    <StatisticsDashboard
      initialData={result.data?.boardStatistics ?? undefined}
    />
  );
}
