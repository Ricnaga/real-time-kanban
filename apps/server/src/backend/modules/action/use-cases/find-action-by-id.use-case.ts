import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '../repositories/action-repository.interface';

@injectable()
export class FindActionByIdUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(actionId: string) {
    const action = await this.actionRepo.findById(actionId);
    if (!action) throw new Error('Action not found');
    return action;
  }
}
