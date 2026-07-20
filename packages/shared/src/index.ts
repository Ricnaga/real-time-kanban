export type BoardDTO = {
  id: string;
  title: string;
  actions: ActionDTO[];
  createdAt: Date;
  updatedAt: Date;
};

export type ActionDTO = {
  id: string;
  title: string;
  position: number;
  isDefault: boolean;
  tasks: TaskDTO[];
};

export type TaskDTO = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  actionId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBoardInput = {
  title: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  actionId?: string;
};

export type UpdateTaskInput = {
  taskId: string;
  title?: string;
  description?: string;
};

export type MoveTaskInput = {
  taskId: string;
  targetActionId: string;
  position: number;
};

export type CreateActionInput = {
  title: string;
  position?: number;
};

export type MoveActionInput = {
  actionId: string;
  newPosition: number;
};

export type ActionStatsDTO = {
  actionId: string;
  actionTitle: string;
  taskCount: number;
};

export type ColumnStatsDTO = {
  id: string;
  title: string;
  step: string;
  taskCount: number;
};

export type BoardStatisticsDTO = {
  columns: ColumnStatsDTO[];
  totalTasks: number;
};

export type BoardEvent = {
  type:
    | 'board:created'
    | 'board:updated'
    | 'task:created'
    | 'task:moved'
    | 'task:updated'
    | 'task:deleted'
    | 'action:created'
    | 'action:deleted'
    | 'action:moved';
  payload: BoardDTO | ActionDTO | TaskDTO | ActionStatsDTO;
};

export type { IPubSub, PubSubChannel } from './types';
export { AppError } from './types';
