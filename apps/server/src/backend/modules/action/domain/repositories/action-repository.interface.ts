import type { IAction } from '../entities/action'
import type { ActionId } from '../value-objects/action-id'

export interface IActionRepository {
  create(action: IAction): Promise<void>
  findAll(): Promise<IAction[]>
  findById(id: ActionId): Promise<IAction | null>
  findByName(name: string): Promise<IAction | null>
  update(action: IAction): Promise<void>
  delete(id: ActionId): Promise<void>
}
