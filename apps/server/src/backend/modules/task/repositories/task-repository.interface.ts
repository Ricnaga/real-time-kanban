import type { Task } from '../entities/task';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  findByActionId(actionId: string): Promise<Task[]>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  updatePositions(items: { id: string; position: number }[]): Promise<void>;
  reindexAfterDelete(actionId: string, deletedPosition: number): Promise<void>;
  countByActionId(actionId: string): Promise<number>;
}
