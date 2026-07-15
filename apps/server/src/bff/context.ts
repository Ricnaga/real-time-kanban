import { adapters } from '@/bff/adapters';
import type { IActionPort } from '@/bff/adapters';
import type { ITaskPort } from '@/bff/adapters';
import type { IPubSub } from '@/backend/shared/interfaces';
import { TYPES } from '@/backend/shared/container/di/types';
import container from '@/backend/shared/container/di/base.di';

export type Context = {
  adapters: {
    action: IActionPort;
    task: ITaskPort;
  };
  pubSub: IPubSub;
};

export const context = (): Context => ({
  adapters,
  pubSub: container.get<IPubSub>(TYPES.PubSub),
});
