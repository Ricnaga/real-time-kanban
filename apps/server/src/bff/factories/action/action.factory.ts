import { actionAdapter } from '@/bff/adapters'
import { ActionFacade } from '@/bff/facades'

export function createActionAdapter() {
  const facade = new ActionFacade()
  return actionAdapter(facade)
}
