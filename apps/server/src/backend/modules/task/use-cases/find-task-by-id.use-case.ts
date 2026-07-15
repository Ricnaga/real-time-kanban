import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { ITaskRepository } from '../repositories/task-repository.interface';

@injectable()
export class FindTaskByIdUseCase {
  constructor(
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(taskId: string) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new AppError(404, 'Task não encontrada');
    return task;
  }
}
