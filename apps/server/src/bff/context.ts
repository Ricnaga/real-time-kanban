import { adapters } from '@/bff/adapters';
import type { IActionPort } from '@/bff/adapters';
import type { ITaskPort } from '@/bff/adapters';
import type { IPubSub } from '@kanban/shared';
import { PubSubConnector } from '@/bff/connectors';

export type Context = {
  adapters: {
    action: IActionPort;
    task: ITaskPort;
  };
  pubSub: IPubSub;
};

const pubSub = new PubSubConnector();

export const createContext = () => (): Context => ({
  adapters,
  pubSub,
});
