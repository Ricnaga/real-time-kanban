'use client';

import { Skeleton } from '@/components/skeleton/skeleton';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

export function StatisticsLoading() {
  const styles = statisticsDashboardStyles();

  return (
    <div className={styles.container()}>
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
