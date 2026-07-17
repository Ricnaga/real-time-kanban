import { tv } from 'tailwind-variants';

export const deleteDialogStyles = tv({
  slots: {
    overlay: [
      'fixed inset-0 z-50',
      'bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out',
    ],
    content: [
      'fixed left-1/2 top-1/2 z-50',
      'w-full max-w-sm -translate-x-1/2 -translate-y-1/2',
      'rounded-xl bg-white p-6 shadow-xl',
      'dark:bg-zinc-900',
      'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150',
    ],
    icon: 'flex justify-center text-red-500 dark:text-red-400 mb-4',
    title: 'text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-center',
    description: 'mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center',
    footer: 'flex justify-end gap-2 mt-6',
    buttonCancel: [
      'rounded-lg px-4 py-2 text-sm font-medium',
      'text-zinc-700 hover:bg-zinc-100',
      'dark:text-zinc-300 dark:hover:bg-zinc-800',
      'cursor-pointer transition-colors',
    ],
    buttonDelete: [
      'rounded-lg px-4 py-2 text-sm font-medium',
      'bg-red-600 text-white hover:bg-red-700',
      'cursor-pointer transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ],
  },
});
