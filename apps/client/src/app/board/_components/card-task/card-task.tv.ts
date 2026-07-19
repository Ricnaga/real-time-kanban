import { tv } from 'tailwind-variants';

export const cardTaskStyles = tv({
  base: 'flex flex-col gap-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm cursor-pointer transition-shadow hover:shadow-md',
  variants: {
    dragging: {
      true: 'opacity-50 shadow-lg',
    },
  },
});
