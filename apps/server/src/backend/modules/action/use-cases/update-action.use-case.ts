import type { IActionRepository } from '../domain/repositories/action-repository.interface'
import { ActionId } from '../domain/value-objects/action-id'
import type { Step } from '../domain/entities/action'

export class UpdateActionUseCase {
  constructor(private readonly actionRepo: IActionRepository) {}

  async execute(actionId: string, data: { title?: string; step?: Step }) {
    const id = new ActionId(actionId)
    const action = await this.actionRepo.findById(id)
    if (!action) throw new Error('Action not found')

    if (data.title !== undefined) action.title = data.title
    if (data.step !== undefined) action.step = data.step

    await this.actionRepo.update(action)
    return action
  }
}
