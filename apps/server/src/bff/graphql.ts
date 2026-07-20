import { createYoga } from 'graphql-yoga';
import { plugins, maskError } from './plugins';
import { schema } from './pothos/schema';
import type { Context } from './context';

export function createGraphQLHandler(context: () => Context) {
  return createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins,
    context,
    maskedErrors: { maskError, errorMessage: 'Erro interno do servidor' },
  });
}
