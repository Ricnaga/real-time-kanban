import { tv } from 'tailwind-variants';

export const textStyles = tv({
  base: 'text-zinc-900 dark:text-zinc-100',
  variants: {
    size: {
      '1': 'text-xs',
      '2': 'text-sm',
      '3': 'text-base',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: '',
      muted: 'text-zinc-500 dark:text-zinc-400',
    },
  },
  defaultVariants: {
    size: '2',
    weight: 'normal',
    color: 'default',
  },
});
