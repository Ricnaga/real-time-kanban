import { createYoga } from 'graphql-yoga'
import { plugins } from './plugins'
import { schema } from './pothos/schema'
import { context } from './context'

export function createGraphQLHandler() {
  return createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins,
    context,
  })
}
