'use client';

import type { ReactNode } from 'react';
import { Text } from '@/components/typography/text/text';
import { statisticsMetricCardStyles } from './statistics-metric-card.tv';

type StatisticsMetricCardProps = {
  label: string;
  value: ReactNode;
};

export function StatisticsMetricCard({
  label,
  value,
}: StatisticsMetricCardProps) {
  const styles = statisticsMetricCardStyles();

  return (
    <div className={styles.card()}>
      <Text as="span" className={styles.label()}>
        {label}
      </Text>
      <Text as="span" className={styles.value()}>
        {value}
      </Text>
    </div>
  );
}
