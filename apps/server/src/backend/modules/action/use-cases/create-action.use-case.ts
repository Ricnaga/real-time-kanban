import type { IActionRepository } from '../domain/repositories/action-repository.interface'
import { Action, Step } from '../domain/entities/action'

export class CreateActionUseCase {
  constructor(private readonly actionRepo: IActionRepository) {}

  async execute(title: string, step: Step) {
    const action = new Action({ title, step })
    await this.actionRepo.create(action)
    return action
  }
}
