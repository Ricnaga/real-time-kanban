import { tv } from 'tailwind-variants';

export const fabStyles = tv({
  base: [
    'fixed bottom-6 right-6 z-50',
    'flex items-center justify-center',
    'w-14 h-14 rounded-full',
    'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
    'shadow-lg hover:shadow-xl hover:scale-110',
    'transition-all duration-200',
    'cursor-pointer',
  ],
});
