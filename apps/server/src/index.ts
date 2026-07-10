import { useHive } from '@graphql-hive/yoga'
import { usePrometheus } from '@graphql-yoga/plugin-prometheus'
import { drizzle } from 'drizzle-orm/node-postgres'
import { createPubSub, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import pg from 'pg'
import { KanbanController } from './backend/controllers/kanban.controller'
import { CreateActionUseCase } from './backend/domain/use-cases/create-action.use-case'
import { CreateTaskUseCase } from './backend/domain/use-cases/create-task.use-case'
import { DeleteActionUseCase } from './backend/domain/use-cases/delete-action.use-case'
import { DeleteTaskUseCase } from './backend/domain/use-cases/delete-task.use-case'
import { GetStatisticsUseCase } from './backend/domain/use-cases/get-statistics.use-case'
import { MoveTaskUseCase } from './backend/domain/use-cases/move-task.use-case'
import { ReorderActionUseCase } from './backend/domain/use-cases/reorder-action.use-case'
import { UpdateTaskUseCase } from './backend/domain/use-cases/update-task.use-case'
import {
  DrizzleActionRepository,
  DrizzleTaskRepository,
} from './backend/infra/database/drizzle/repo'
import * as schema from './backend/infra/database/drizzle/schema'
import { createAdapters } from './bff/adapters'
import type { Context } from './bff/pothos/builder'
import { schema as gqlSchema } from './bff/pothos/schema'
import { loadEnvironment } from './config'

async function main() {
  const { DATABASE_URL, PORT, HIVE_TOKEN, HIVE_TARGET } = loadEnvironment()

  const pool = new pg.Pool({ connectionString: DATABASE_URL })
  const db = drizzle(pool, { schema })

  const pubSub = createPubSub()

  const actionRepo = new DrizzleActionRepository(db)
  const taskRepo = new DrizzleTaskRepository(db)

  const eventPublisher = {
    publish: async (topic: string, payload: unknown) => {
      pubSub.publish(topic, payload)
    },
  }

  const moveTaskUseCase = new MoveTaskUseCase(
    actionRepo,
    taskRepo,
    eventPublisher,
  )
  const createTaskUseCase = new CreateTaskUseCase(
    actionRepo,
    taskRepo,
    eventPublisher,
  )
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepo, eventPublisher)
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo, eventPublisher)
  const createActionUseCase = new CreateActionUseCase(
    actionRepo,
    eventPublisher,
  )
  const deleteActionUseCase = new DeleteActionUseCase(
    actionRepo,
    taskRepo,
    eventPublisher,
  )
  const reorderActionUseCase = new ReorderActionUseCase(
    actionRepo,
    eventPublisher,
  )
  const getStatisticsUseCase = new GetStatisticsUseCase(actionRepo, taskRepo)
  const kanbanController = new KanbanController(
    actionRepo,
    taskRepo,
    eventPublisher,
    moveTaskUseCase,
    createTaskUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    createActionUseCase,
    deleteActionUseCase,
    reorderActionUseCase,
    getStatisticsUseCase,
  )

  await kanbanController.seed()

  const adapters = createAdapters(kanbanController)

  const yoga = createYoga<Context>({
    schema: gqlSchema,
    context: () => ({
      adapters,
      pubSub,
    }),
    graphqlEndpoint: '/graphql',
    fetchAPI: { Response },
    plugins: [
      usePrometheus({
        endpoint: '/metrics',
      }),
      ...(HIVE_TOKEN && HIVE_TARGET
        ? [
            useHive({
              enabled: true,
              token: HIVE_TOKEN,
              usage: { target: HIVE_TARGET },
            }),
          ]
        : []),
    ],
  })

  const server = createServer(yoga)

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`)
  })
}

main()
