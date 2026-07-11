import type { IActionRepository } from '../domain/repositories/action-repository.interface'

export class ListActionsUseCase {
  constructor(private readonly actionRepo: IActionRepository) {}

  async execute() {
    return this.actionRepo.findAll()
  }
}
