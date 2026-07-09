import type { Action } from '../domain/entities/action.entity'

export interface ActionRepository {
  findAll(): Promise<Action[]>
  findById(id: string): Promise<Action | null>
  save(action: Action): Promise<void>
  delete(id: string): Promise<void>
  updatePositions(items: Array<{ id: string; position: number }>): Promise<void>
}
