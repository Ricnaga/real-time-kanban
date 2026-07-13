import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { IActionRepository } from '../repositories/action-repository.interface';

@injectable()
export class UpdateActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(actionId: string, data: { title?: string; step?: string }) {
    const action = await this.actionRepo.findById(actionId);
    if (!action) throw new AppError(404, 'Action not found');

    if (data.title !== undefined) action.title = data.title;
    if (data.step !== undefined) action.step = data.step;

    await this.actionRepo.update(action);
    return action;
  }
}
