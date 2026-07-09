import type { KanbanController } from '../../backend/controllers/kanban.controller'
import { createActionAdapters } from './action.adapter'

export type Adapters = {
  action: ReturnType<typeof createActionAdapters>
}

export const createAdapters = (controller: KanbanController): Adapters => ({
  action: createActionAdapters(controller),
})
