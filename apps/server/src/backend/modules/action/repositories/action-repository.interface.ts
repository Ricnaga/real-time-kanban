import type { IAction } from '../entities/action';

export interface IActionRepository {
  create(action: IAction): Promise<void>;
  findAll(): Promise<IAction[]>;
  findById(id: string): Promise<IAction | null>;
  findByName(name: string): Promise<IAction | null>;
  update(action: IAction): Promise<void>;
  delete(id: string): Promise<void>;
}
