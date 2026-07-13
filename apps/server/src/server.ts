import fastify from 'fastify';
import type { YogaServerInstance } from 'graphql-yoga';
import { loadEnvironment } from './config';
import { logServerOnline } from './utils/server.logs';

export function initServer(yoga: YogaServerInstance<{}, {}>) {
  const { PORT } = loadEnvironment();

  const app = fastify({ logger: false });

  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: (req, reply) => yoga.handleNodeRequestAndResponse(req, reply),
  });

  app.listen({ port: PORT, host: '0.0.0.0' }, () => {
    logServerOnline(PORT);
  });
}
