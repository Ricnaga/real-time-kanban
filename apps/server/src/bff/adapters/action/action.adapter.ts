import { ActionFacade } from '@/bff/facades'
import { IActionPort } from './action-port'

export function actionAdapter(facade: ActionFacade): IActionPort {
  return {
    findAll: () => facade.findAll(),
    findById: (id) => facade.findById(id),
    create: (data) => facade.create(data),
    update: (data) => facade.update(data),
    delete: (id) => facade.delete(id),
  }
}
