import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '../repositories/action-repository.interface';
import { ActionId } from '../value-objects/action-id';

@injectable()
export class DeleteActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(actionId: string) {
    const id = new ActionId(actionId);
    const action = await this.actionRepo.findById(id);
    if (!action) throw new Error('Action not found');

    await this.actionRepo.delete(id);
  }
}
