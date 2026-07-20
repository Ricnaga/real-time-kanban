import { initInstance } from './backend/instance';
import { createGraphQLHandler } from './bff/graphql';
import { initServer } from './server';

async function main() {
  const status = await initInstance();
  const yoga = createGraphQLHandler();
  initServer(yoga, status);
}

main();
