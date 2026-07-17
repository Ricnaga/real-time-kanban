import { tv } from 'tailwind-variants';

export const cardTaskActionsStyles = tv({
  slots: {
    divider: 'border-t border-zinc-200 dark:border-zinc-700 mt-2 pt-2',
    actions: 'flex items-center gap-1',
    button: [
      'flex items-center justify-center',
      'p-1.5 rounded-md',
      'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100',
      'dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-700',
      'transition-colors cursor-pointer',
    ],
  },
});
