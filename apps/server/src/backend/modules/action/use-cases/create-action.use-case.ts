import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '../repositories/action-repository.interface';
import type { CreateActionDTO } from '../dto/create.dto';
import { Action } from '../entities/action';

@injectable()
export class CreateActionUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
  ) {}

  async execute(data: CreateActionDTO) {
    const position = await this.actionRepo.count();
    const action = new Action({ title: data.title, step: data.step, position });
    await this.actionRepo.create(action);
    return action;
  }
}
