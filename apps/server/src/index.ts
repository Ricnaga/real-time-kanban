import { initInstance } from './backend/instance';
import container from './backend/shared/container';
import { TYPES } from './backend/shared/container/di/types';
import { createGraphQLHandler } from './bff/graphql';
import { initServer } from './server';
import type { IPubSub } from '@kanban/shared';

async function main() {
  const status = await initInstance();

  const pubSub = container.get<IPubSub>(TYPES.PubSub);
  const yoga = createGraphQLHandler(pubSub);
  initServer(yoga, status);
}

main();
