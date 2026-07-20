import { getClient } from '@/services/urql-rsc';
import { GET_BOARD_STATISTICS } from '@/services/graphql/queries';
import { Text } from '@/components/typography/text/text';
import { StatisticsDashboard } from './_components/statistics-dashboard/statistics-dashboard';

export default async function StatisticsPage() {
  const client = getClient();
  const result = await client.query(GET_BOARD_STATISTICS, {});

  if (result.error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" className="text-red-500">
          Erro ao carregar estatisticas: {result.error.message}
        </Text>
      </div>
    );
  }

  return (
    <StatisticsDashboard
      initialData={result.data?.boardStatistics ?? undefined}
    />
  );
}
