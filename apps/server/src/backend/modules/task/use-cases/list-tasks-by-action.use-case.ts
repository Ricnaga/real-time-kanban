import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { ITaskRepository } from '../repositories/task-repository.interface';
import type { IActionRepository } from '@/backend/modules/action/repositories/action-repository.interface';

@injectable()
export class ListTasksByActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(actionId: string) {
    const action = await this.actionRepo.findById(actionId);
    if (!action) throw new AppError(404, 'Action não encontrada');

    return this.taskRepo.findByActionId(actionId);
  }
}
