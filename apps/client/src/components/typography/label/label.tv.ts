import { tv } from 'tailwind-variants';

export const labelStyles = tv({
  base: 'text-sm font-medium text-zinc-700 dark:text-zinc-300',
  variants: {
    size: {
      '1': 'text-xs',
      '2': 'text-sm',
    },
    weight: {
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    color: {
      default: '',
      muted: 'text-zinc-500 dark:text-zinc-400',
    },
  },
  defaultVariants: {
    size: '2',
    weight: 'medium',
    color: 'default',
  },
});
