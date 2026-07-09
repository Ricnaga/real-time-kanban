import type { Task } from '../domain/entities/task.entity'

export interface TaskRepository {
  findByActionIds(actionIds: string[]): Promise<Task[]>
  findById(id: string): Promise<Task | null>
  save(task: Task): Promise<void>
  delete(id: string): Promise<void>
  updateActionId(
    taskId: string,
    actionId: string,
    position: number,
  ): Promise<void>
}
