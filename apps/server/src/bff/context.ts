import { adapters } from '@/bff/adapters';
import type { IActionPort } from '@/bff/adapters';

export type Context = {
  adapters: {
    action: IActionPort;
  };
};

export const context = (): Context => ({
  adapters,
});
