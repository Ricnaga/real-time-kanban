import fastify from 'fastify';
import type { YogaServerInstance } from 'graphql-yoga';
import type { Context } from '../bff/context';
import { loadEnvironment } from '../config';
import { initStartupLogs } from '../utils/server.logs';
import type { StatusLine } from '../utils/server.logs';
import { initWebSocket } from './websocket';

export function initServer(
  yoga: YogaServerInstance<{}, Context>,
  status: StatusLine[],
) {
  const { PORT } = loadEnvironment();

  const app = fastify({ logger: false });

  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: (req, reply) => yoga.handleNodeRequestAndResponse(req, reply),
  });

  initWebSocket(app.server, yoga);

  app.listen({ port: PORT, host: '0.0.0.0' }, () => {
    initStartupLogs(PORT, status);
  });
}
