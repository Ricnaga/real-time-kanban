'use client';

import { Skeleton } from '@/components/skeleton/skeleton';

export function BoardLoading() {
  return (
    <div className="flex flex-1 gap-4 p-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="shrink-0 w-72 h-64" />
      ))}
    </div>
  );
}
