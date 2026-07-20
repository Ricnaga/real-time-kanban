'use client';

import type { ReactNode } from 'react';
import { Text } from '@/components/typography/text/text';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

type StatisticsChartCardProps = {
  title: string;
  children: ReactNode;
};

export function StatisticsChartCard({
  title,
  children,
}: StatisticsChartCardProps) {
  const styles = statisticsDashboardStyles();

  return (
    <div className={styles.chartCard()}>
      <Text as="span" className={styles.chartTitle()}>
        {title}
      </Text>
      {children}
    </div>
  );
}
