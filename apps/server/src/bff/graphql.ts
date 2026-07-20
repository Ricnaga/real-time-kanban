import { createYoga } from 'graphql-yoga';
import { plugins, maskError } from './plugins';
import { schema } from './pothos/schema';
import { createContext } from './context';

export function createGraphQLHandler() {
  return createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins,
    context: createContext(),
    maskedErrors: { maskError, errorMessage: 'Erro interno do servidor' },
  });
}
