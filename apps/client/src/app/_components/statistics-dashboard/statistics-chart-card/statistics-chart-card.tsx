'use client';

import type { ReactNode } from 'react';
import { Text } from '@/components/typography/text/text';
import { statisticsChartCardStyles } from './statistics-chart-card.tv';

type StatisticsChartCardProps = {
  title: string;
  children: ReactNode;
};

export function StatisticsChartCard({
  title,
  children,
}: StatisticsChartCardProps) {
  const styles = statisticsChartCardStyles();

  return (
    <div className={styles.card()}>
      <Text as="span" className={styles.title()}>
        {title}
      </Text>
      {children}
    </div>
  );
}
