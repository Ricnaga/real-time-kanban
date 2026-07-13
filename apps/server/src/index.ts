import { initInstance } from './backend/instance';
import { createGraphQLHandler } from './bff/graphql';
import { initServer } from './server';

async function main() {
  await initInstance();

  const yoga = createGraphQLHandler();
  initServer(yoga);
}

main();
