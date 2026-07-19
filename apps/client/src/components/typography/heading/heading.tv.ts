import { tv } from 'tailwind-variants';

export const headingStyles = tv({
  base: 'text-zinc-900 dark:text-zinc-100',
  variants: {
    size: {
      '1': 'text-base font-semibold',
      '2': 'text-lg font-semibold',
      '3': 'text-xl font-semibold',
      '4': 'text-2xl font-bold',
      '5': 'text-3xl font-bold',
      '6': 'text-4xl font-bold',
    },
    color: {
      default: '',
      muted: 'text-zinc-500 dark:text-zinc-400',
    },
  },
  defaultVariants: {
    size: '2',
    color: 'default',
  },
});
