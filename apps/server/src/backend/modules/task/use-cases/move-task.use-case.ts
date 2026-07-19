import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { ITaskRepository } from '../repositories/task-repository.interface';
import type { MoveTaskDTO } from '../dto/move.dto';

@injectable()
export class MoveTaskUseCase {
  constructor(
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute({ taskId, newPosition, newActionId }: MoveTaskDTO) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new AppError(404, 'Task não encontrada');

    if (newActionId && task.actionId !== newActionId) {
      return this.moveToAnotherAction(task, newActionId, newPosition);
    }

    return this.reorderWithinAction(task, newPosition);
  }

  private async moveToAnotherAction(
    task: Awaited<ReturnType<typeof this.taskRepo.findById>> & {},
    newActionId: string,
    newPosition: number,
  ) {
    const oldActionId = task.actionId;
    const oldPosition = task.position;

    task.actionId = newActionId;
    task.position = newPosition;
    await this.taskRepo.update(task);

    await this.taskRepo.reindexAfterDelete(oldActionId, oldPosition);

    const tasksInNewColumn = await this.taskRepo.findByActionId(newActionId);
    const total = tasksInNewColumn.length;

    const clamped = Math.max(0, Math.min(newPosition, total - 1));
    task.position = clamped;

    const reordered = tasksInNewColumn.filter((t) => t.id !== task.id);
    reordered.splice(clamped, 0, task);

    const updates = reordered.map((t, i) => ({ id: t.id, position: i }));
    await this.taskRepo.updatePositions(updates);

    const destTasks = await this.taskRepo.findByActionId(newActionId);
    const sourceTasks = await this.taskRepo.findByActionId(oldActionId);

    return [...destTasks, ...sourceTasks];
  }

  private async reorderWithinAction(
    task: Awaited<ReturnType<typeof this.taskRepo.findById>> & {},
    newPosition: number,
  ) {
    if (task.position === newPosition) {
      return this.taskRepo.findByActionId(task.actionId);
    }

    const all = await this.taskRepo.findByActionId(task.actionId);
    const total = all.length;

    const clamped = Math.max(0, Math.min(newPosition, total - 1));

    const reordered = all.filter((t) => t.id !== task.id);
    reordered.splice(clamped, 0, task);

    const updates = reordered.map((t, i) => ({ id: t.id, position: i }));
    await this.taskRepo.updatePositions(updates);

    return this.taskRepo.findByActionId(task.actionId);
  }
}
