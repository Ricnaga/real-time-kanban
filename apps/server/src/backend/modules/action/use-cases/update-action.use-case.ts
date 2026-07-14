import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { IActionRepository } from '../repositories/action-repository.interface';
import type { UpdateActionDTO } from '../dto/update.dto';
import { ActionTitle } from '../value-objects/action-title';
import { StepValue } from '../value-objects/step-value';

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
      action.rename(new ActionTitle(data.title));
    }

    if (data.step !== undefined) {
      action.changeStep(new StepValue(data.step));
    }

    if (data.position !== undefined) {
      action.moveTo(data.position);
    }

    await this.actionRepo.update(action);
    return action;
  }
}
