import type { Action } from '../entities/action';

export interface IActionRepository {
  create(action: Action): Promise<void>;
  findAll(): Promise<Action[]>;
  findById(id: string): Promise<Action | null>;
  findByName(name: string): Promise<Action | null>;
  update(action: Action): Promise<void>;
  delete(id: string): Promise<void>;
  updatePositions(items: { id: string; position: number }[]): Promise<void>;
  reindexAfterDelete(deletedPosition: number): Promise<void>;
  count(): Promise<number>;
}
