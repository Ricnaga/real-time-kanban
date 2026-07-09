import type { ActionRepository } from '../../ports/action-repository.port'
import type { TaskRepository } from '../../ports/task-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { ActionNotFoundError } from '../entities/errors'

export class DeleteActionUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(actionId: string) {
    const action = await this.actionRepo.findById(actionId)
    if (!action) throw new ActionNotFoundError(actionId)

    action.canDelete()

    const tasks = await this.taskRepo.findByActionIds([actionId])
    for (const task of tasks) {
      await this.taskRepo.delete(task.id)
    }

    await this.actionRepo.delete(actionId)

    await this.eventBus.publish('action:deleted', { actionId })
  }
}
