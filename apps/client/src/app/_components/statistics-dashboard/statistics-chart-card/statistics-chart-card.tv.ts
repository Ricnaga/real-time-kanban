import { tv } from 'tailwind-variants';

export const statisticsChartCardStyles = tv({
  slots: {
    card: 'flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900',
    title: 'text-sm font-semibold text-zinc-700 dark:text-zinc-300',
  },
});
