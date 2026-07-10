import { usePrometheus } from '@graphql-yoga/plugin-prometheus'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { loadEnvironment } from './config'
import { schema } from './bff/pothos/schema'

async function main() {
  const { PORT } = loadEnvironment()

  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins: [
      usePrometheus({
        endpoint: '/metrics',
      }),
    ],
  })

  const server = createServer(yoga)

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`)
  })
}

main()
