import { tv } from 'tailwind-variants';

export const columnStyles = tv({
  slots: {
    base: 'flex flex-col h-full min-w-[280px] max-w-[320px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900',
    header:
      'flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800',
    title:
      'text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide',
    count:
      'text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full',
    list: 'flex flex-col gap-2 p-3 overflow-y-auto flex-1',
    card: 'flex flex-col gap-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 shadow-sm cursor-pointer transition-shadow hover:shadow-md',
    cardTitle: 'text-sm font-medium text-zinc-900 dark:text-zinc-100',
    cardDescription:
      'text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2',
  },
});
