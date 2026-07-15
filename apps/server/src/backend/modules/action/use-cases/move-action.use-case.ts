import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { IActionRepository } from '../repositories/action-repository.interface';
import type { MoveActionDTO } from '../dto/move.dto';

@injectable()
export class MoveActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute({ actionId, newPosition }: MoveActionDTO) {
    const action = await this.actionRepo.findById(actionId);
    if (!action) throw new AppError(404, 'Ação não encontrada');

    if (action.position === newPosition) {
      return this.actionRepo.findAll();
    }

    const all = await this.actionRepo.findAll();
    const total = all.length;

    const clamped = Math.max(0, Math.min(newPosition, total - 1));

    const reordered = all.filter((a) => a.id !== actionId);
    reordered.splice(clamped, 0, action);

    const updates = reordered.map((a, i) => ({ id: a.id, position: i }));
    await this.actionRepo.updatePositions(updates);

    return reordered;
  }
}
