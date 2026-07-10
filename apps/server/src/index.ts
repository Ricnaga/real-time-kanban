import { createYoga } from 'graphql-yoga'
import { plugins } from './bff/plugins'
import { schema } from './bff/pothos/schema'
import { initServer } from './server'

async function main() {
  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins,
  })

  initServer(yoga)
}

main()
