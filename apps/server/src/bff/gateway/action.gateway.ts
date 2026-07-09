import type { KanbanController } from '../../backend/controllers/kanban.controller'
import type { ActionWithTasksDTO } from '../../backend/controllers/kanban.controller'

export const createActionGateway = (controller: KanbanController) => ({
  getAll: (): Promise<ActionWithTasksDTO[]> => controller.getActions(),

  create: (title: string, position?: number): Promise<ActionWithTasksDTO[]> =>
    controller.createAction(title, position),

  remove: (actionId: string): Promise<ActionWithTasksDTO[]> =>
    controller.deleteAction(actionId),

  reorder: (
    actionId: string,
    newPosition: number,
  ): Promise<ActionWithTasksDTO[]> =>
    controller.reorderAction(actionId, newPosition),
})
