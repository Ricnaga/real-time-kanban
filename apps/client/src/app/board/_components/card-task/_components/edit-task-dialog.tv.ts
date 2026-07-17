import { tv } from 'tailwind-variants';

export const editDialogStyles = tv({
  slots: {
    overlay: [
      'fixed inset-0 z-50',
      'bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out',
    ],
    content: [
      'fixed left-1/2 top-1/2 z-50',
      'w-full max-w-md -translate-x-1/2 -translate-y-1/2',
      'rounded-xl bg-white p-6 shadow-xl',
      'dark:bg-zinc-900',
      'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150',
    ],
    title: 'text-lg font-semibold text-zinc-900 dark:text-zinc-100',
    description: 'mt-1 text-sm text-zinc-500 dark:text-zinc-400',
    form: 'mt-4 flex flex-col gap-4',
    input: [
      'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm',
      'text-zinc-900 placeholder:text-zinc-400',
      'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500',
      'outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500',
      'dark:focus:border-zinc-400 dark:focus:ring-zinc-400',
    ],
    textarea: [
      'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm',
      'text-zinc-900 placeholder:text-zinc-400',
      'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500',
      'outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500',
      'dark:focus:border-zinc-400 dark:focus:ring-zinc-400',
      'resize-none',
    ],
    footer: 'flex justify-end gap-2 mt-2',
    buttonCancel: [
      'rounded-lg px-4 py-2 text-sm font-medium',
      'text-zinc-700 hover:bg-zinc-100',
      'dark:text-zinc-300 dark:hover:bg-zinc-800',
      'cursor-pointer transition-colors',
    ],
    buttonSubmit: [
      'rounded-lg px-4 py-2 text-sm font-medium',
      'bg-zinc-900 text-white hover:bg-zinc-800',
      'dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
      'cursor-pointer transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ],
  },
});
