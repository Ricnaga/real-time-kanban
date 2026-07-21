import { tv } from 'tailwind-variants';

export const statisticsDashboardStyles = tv({
  slots: {
    container: 'flex flex-1 flex-col gap-6 p-6',
    header: 'flex flex-col gap-1',
    subtitle: 'text-sm text-zinc-500 dark:text-zinc-400',
  },
});
