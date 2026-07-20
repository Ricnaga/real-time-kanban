'use client';

import { Text } from '@/components/typography/text/text';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

export function StatisticsEmpty() {
  const styles = statisticsDashboardStyles();

  return (
    <div className={styles.container()}>
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" color="muted">
          Nenhum dado disponivel
        </Text>
      </div>
    </div>
  );
}
