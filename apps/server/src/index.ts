import { createYoga, createPubSub } from 'graphql-yoga'
import { createServer } from 'node:http'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './backend/infra/database/drizzle/schema'
import { DrizzleBoardRepository } from './backend/infra/database/drizzle/repo'
import { CreateBoardUseCase } from './backend/domain/use-cases/create-board.use-case'
import { ListBoardsUseCase } from './backend/domain/use-cases/list-boards.use-case'
import { MoveCardUseCase } from './backend/domain/use-cases/move-card.use-case'
import { BoardController } from './backend/controllers/board.controller'
import { schema as gqlSchema } from './bff/schema'
import type { Context } from './bff/builder'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

const pubSub = createPubSub()

const boardRepo = new DrizzleBoardRepository(db)

const eventPublisher = {
  publish: async (topic: string, payload: unknown) => {
    pubSub.publish(topic, payload)
  },
}

const createBoardUseCase = new CreateBoardUseCase(boardRepo)
const listBoardsUseCase = new ListBoardsUseCase(boardRepo)
const moveCardUseCase = new MoveCardUseCase(boardRepo, eventPublisher)
const boardController = new BoardController(
  createBoardUseCase,
  listBoardsUseCase,
  moveCardUseCase,
)

const yoga = createYoga<Context>({
  schema: gqlSchema,
  context: () => ({
    boardController,
    pubSub,
  }),
  graphqlEndpoint: '/graphql',
  fetchAPI: { Response },
})

const server = createServer(yoga)

const PORT = Number(process.env.PORT) || 4000

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`)
})
