import { adapters } from '@/bff/adapters';
import type { IActionPort } from '@/bff/adapters';
import type { ITaskPort } from '@/bff/adapters';
import type { IPubSub } from '@kanban/shared';

export type Context = {
  adapters: {
    action: IActionPort;
    task: ITaskPort;
  };
  pubSub: IPubSub;
};

export const createContext = (pubSub: IPubSub) => (): Context => ({
  adapters,
  pubSub,
});
