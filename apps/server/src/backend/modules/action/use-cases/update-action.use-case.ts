import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { IActionRepository } from '../repositories/action-repository.interface';
import type { UpdateActionDTO } from '../dto/update.dto';

@injectable()
export class UpdateActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(data: UpdateActionDTO) {
    const action = await this.actionRepo.findById(data.id);
    if (!action) throw new AppError(404, 'Ação não encontrada');

    if (data.title !== undefined) {
      action.title = data.title;
    }

    if (data.step !== undefined) {
      action.step = data.step;
    }

    if (data.position !== undefined) {
      action.position = data.position;
    }

    await this.actionRepo.update(action);
    return action;
  }
}
