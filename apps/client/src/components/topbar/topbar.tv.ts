import { tv } from 'tailwind-variants';

export const topbarStyles = tv({
  slots: {
    root: 'border-b border-zinc-200 dark:border-zinc-800',
    list: 'flex items-center gap-1 px-6 py-3',
    link: [
      'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
      'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
      'dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800',
      'data-[active]:text-zinc-900 data-[active]:bg-zinc-100',
      'dark:data-[active]:text-zinc-100 dark:data-[active]:bg-zinc-800',
    ],
  },
});
