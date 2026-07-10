import { createGraphQLHandler } from './bff/graphql'
import { initServer } from './main'
import { initBackend } from './backend/server'

async function main() {
  await initBackend()

  const yoga = createGraphQLHandler()
  initServer(yoga)
}

main()
