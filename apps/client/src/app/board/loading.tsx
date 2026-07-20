import { Skeleton } from '@/components/skeleton/skeleton';

export default function BoardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 gap-4 p-6 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="shrink-0 w-72 h-64" />
        ))}
      </main>
    </div>
  );
}
