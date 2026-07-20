'use client';

import { Text } from '@/components/typography/text/text';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

type StatisticsErrorProps = {
  message: string;
};

export function StatisticsError({ message }: StatisticsErrorProps) {
  const styles = statisticsDashboardStyles();

  return (
    <div className={styles.container()}>
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" className="text-red-500">
          Erro ao carregar estatisticas: {message}
        </Text>
      </div>
    </div>
  );
}
