import { createYoga } from 'graphql-yoga';
import { plugins, maskError } from './plugins';
import { schema } from './pothos/schema';
import { createContext } from './context';
import type { IPubSub } from '@kanban/shared';

export function createGraphQLHandler(pubSub: IPubSub) {
  return createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins,
    context: createContext(pubSub),
    maskedErrors: { maskError, errorMessage: 'Erro interno do servidor' },
  });
}
