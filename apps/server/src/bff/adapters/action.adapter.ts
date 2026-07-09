import { createActionGateway } from '../gateway/action.gateway'
import { Action } from '../domain/action.domain'
import type { KanbanController } from '../../backend/controllers/kanban.controller'

export const createActionAdapters = (controller: KanbanController) => {
  const gateway = createActionGateway(controller)

  return {
    getAll: () =>
      gateway.getAll().then((dtos) => dtos.map((dto) => new Action(dto))),

    create: (title: string, position?: number) =>
      gateway
        .create(title, position)
        .then((dtos) => dtos.map((dto) => new Action(dto))),

    remove: (actionId: string) =>
      gateway
        .remove(actionId)
        .then((dtos) => dtos.map((dto) => new Action(dto))),

    reorder: (actionId: string, newPosition: number) =>
      gateway
        .reorder(actionId, newPosition)
        .then((dtos) => dtos.map((dto) => new Action(dto))),
  }
}
