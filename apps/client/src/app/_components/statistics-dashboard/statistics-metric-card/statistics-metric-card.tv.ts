import { tv } from 'tailwind-variants';

export const statisticsMetricCardStyles = tv({
  slots: {
    card: 'flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900',
    label:
      'text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400',
    value: 'text-2xl font-bold text-zinc-900 dark:text-zinc-100',
  },
});
