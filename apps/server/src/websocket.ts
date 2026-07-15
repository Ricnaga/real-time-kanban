import type { ExecutionArgs } from 'graphql';
import { useServer } from 'graphql-ws/use/ws';
import type { YogaServerInstance } from 'graphql-yoga';
import type http from 'node:http';
import { WebSocketServer } from 'ws';
import type { Context } from './bff/context';

interface EnvelopedExecutionArgs extends ExecutionArgs {
  rootValue: {
    execute: (args: ExecutionArgs) => unknown;
    subscribe: (args: ExecutionArgs) => unknown;
  };
}

export function initWebSocket(
  httpServer: http.Server,
  yoga: YogaServerInstance<{}, Context>,
) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yoga.graphqlEndpoint,
  });

  useServer(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      execute: (args: any) => args.rootValue.execute(args),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, _id, params) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yoga.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params,
          });

        const args: EnvelopedExecutionArgs = {
          schema,
          operationName: params.operationName,
          document: parse(params.query),
          variableValues: params.variables,
          contextValue: await contextFactory(),
          rootValue: { execute, subscribe },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer,
  );

  return wsServer;
}
