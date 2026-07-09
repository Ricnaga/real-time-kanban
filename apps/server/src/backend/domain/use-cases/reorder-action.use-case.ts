import type { ActionRepository } from '../../ports/action-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { ActionNotFoundError } from '../entities/errors'

export class ReorderActionUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(actionId: string, newPosition: number) {
    const actions = await this.actionRepo.findAll()
    const index = actions.findIndex((a) => a.id === actionId)
    if (index === -1) throw new ActionNotFoundError(actionId)

    const [action] = actions.splice(index, 1)
    actions.splice(newPosition, 0, action)
    actions.forEach((a, i) => {
      a.position = i
    })

    await this.actionRepo.updatePositions(
      actions.map((a) => ({ id: a.id, position: a.position })),
    )

    await this.eventBus.publish('action:reordered', { actionId })
  }
}
