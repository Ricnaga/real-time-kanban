import type { ActionRepository } from '../../ports/action-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { Action } from '../entities/action.entity'

export class CreateActionUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(title: string, position?: number) {
    const actions = await this.actionRepo.findAll()
    const maxPos = Math.max(...actions.map((a) => a.position), -1)
    const pos = position ?? maxPos + 1

    const action = new Action(crypto.randomUUID(), title, pos, false)
    await this.actionRepo.save(action)

    await this.eventBus.publish('action:created', { actionId: action.id })
  }
}
