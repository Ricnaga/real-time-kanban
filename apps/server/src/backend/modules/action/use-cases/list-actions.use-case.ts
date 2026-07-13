import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '../repositories/action-repository.interface';

@injectable()
export class ListActionsUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute() {
    return this.actionRepo.findAll();
  }
}
