import type { TaskDomain } from '../../domain/task';

export type TaskCreateInput = {
  title: string;
  description?: string | null;
  actionId: string;
};

export type TaskUpdateInput = {
  id: string;
  title?: string;
  description?: string | null;
  position?: number;
  actionId?: string;
};

export interface ITaskPort {
  findById(id: string): Promise<TaskDomain>;
  findByActionId(actionId: string): Promise<TaskDomain[]>;
  create(data: TaskCreateInput): Promise<TaskDomain>;
  update(data: TaskUpdateInput): Promise<TaskDomain>;
  delete(id: string): Promise<void>;
  move(
    taskId: string,
    newPosition: number,
    newActionId?: string,
  ): Promise<TaskDomain[]>;
}
