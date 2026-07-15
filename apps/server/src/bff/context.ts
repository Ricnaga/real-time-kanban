import { adapters } from '@/bff/adapters';
import type { IActionPort } from '@/bff/adapters';
import type { ITaskPort } from '@/bff/adapters';

export type Context = {
  adapters: {
    action: IActionPort;
    task: ITaskPort;
  };
};

export const context = (): Context => ({
  adapters,
});
