import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '../repositories/action-repository.interface';
import { Action, Step } from '../entities/action';

@injectable()
export class CreateActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(title: string, step: Step) {
    const action = new Action({ title, step });
    await this.actionRepo.create(action);
    return action;
  }
}
