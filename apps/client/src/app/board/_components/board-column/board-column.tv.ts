import { tv } from 'tailwind-variants';

export const boardColumnStyles = tv({
  slots: {
    base: 'flex flex-col h-full min-w-[280px] max-w-[320px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900',
    header:
      'flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800',
    title:
      'text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide',
    count:
      'text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full',
    scrollArea: 'flex-1 overflow-hidden',
    scrollViewport: 'flex flex-col gap-2 p-3',
    list: 'flex flex-col gap-2',
  },
});
