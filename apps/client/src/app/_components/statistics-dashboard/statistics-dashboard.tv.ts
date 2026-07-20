import { tv } from 'tailwind-variants';

export const statisticsDashboardStyles = tv({
  slots: {
    container: 'flex flex-1 flex-col gap-6 p-6',
    header: 'flex flex-col gap-1',
    subtitle: 'text-sm text-zinc-500 dark:text-zinc-400',
    metricCard:
      'flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900',
    metricLabel:
      'text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400',
    metricValue: 'text-2xl font-bold text-zinc-900 dark:text-zinc-100',
    chartCard:
      'flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900',
    chartTitle: 'text-sm font-semibold text-zinc-700 dark:text-zinc-300',
  },
});
