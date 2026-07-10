import { createServer } from 'node:http'
import type { YogaServerInstance } from 'graphql-yoga'
import { loadEnvironment } from './config'

export function initServer(yoga: YogaServerInstance<{}, {}>) {
  const { PORT } = loadEnvironment()

  const server = createServer(yoga)

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`)
  })
}
