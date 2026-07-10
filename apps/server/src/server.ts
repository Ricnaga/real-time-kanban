import { createServer } from 'node:http'
import type { YogaServerInstance } from 'graphql-yoga'
import { loadEnvironment } from './config'
import { logger } from './utils/logs'

export function initServer(yoga: YogaServerInstance<{}, {}>) {
  const { PORT } = loadEnvironment()

  const server = createServer(yoga)

  server.listen(PORT, () => {
    logger.success(`Server running on http://localhost:${PORT}/graphql`)
  })
}
