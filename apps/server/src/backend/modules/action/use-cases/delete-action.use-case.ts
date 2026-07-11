import type { IActionRepository } from '../domain/repositories/action-repository.interface'
import { ActionId } from '../domain/value-objects/action-id'

export class DeleteActionUseCase {
  constructor(private readonly actionRepo: IActionRepository) {}

  async execute(actionId: string) {
    const id = new ActionId(actionId)
    const action = await this.actionRepo.findById(id)
    if (!action) throw new Error('Action not found')

    await this.actionRepo.delete(id)
  }
}
