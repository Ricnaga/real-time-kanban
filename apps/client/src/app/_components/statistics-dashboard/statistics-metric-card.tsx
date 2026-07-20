'use client';

import type { ReactNode } from 'react';
import { Text } from '@/components/typography/text/text';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

type StatisticsMetricCardProps = {
  label: string;
  value: ReactNode;
};

export function StatisticsMetricCard({
  label,
  value,
}: StatisticsMetricCardProps) {
  const styles = statisticsDashboardStyles();

  return (
    <div className={styles.metricCard()}>
      <Text as="span" className={styles.metricLabel()}>
        {label}
      </Text>
      <Text as="span" className={styles.metricValue()}>
        {value}
      </Text>
    </div>
  );
}
