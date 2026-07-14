import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { IActionRepository } from '../repositories/action-repository.interface';

@injectable()
export class MoveActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(actionId: string, newPosition: number) {
    const action = await this.actionRepo.findById(actionId);
    if (!action) throw new AppError(404, 'Ação não encontrada');

    if (action.isAtPosition(newPosition)) {
      return this.actionRepo.findAll();
    }

    const all = await this.actionRepo.findAll();
    const total = all.length;

    const clamped = Math.max(0, Math.min(newPosition, total - 1));

    action.moveTo(clamped);

    const reordered = all.filter((a) => a.id.value !== actionId);
    reordered.splice(clamped, 0, action);

    const updates = reordered.map((a, i) => ({ id: a.id.value, position: i }));
    await this.actionRepo.updatePositions(updates);

    return reordered;
  }
}
