import type { ActionRepository } from '../../ports/action-repository.port'
import type { TaskRepository } from '../../ports/task-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { TaskNotFoundError, ActionNotFoundError } from '../entities/errors'

export class MoveTaskUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(taskId: string, targetActionId: string, position: number) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) throw new TaskNotFoundError(taskId)

    const targetAction = await this.actionRepo.findById(targetActionId)
    if (!targetAction) throw new ActionNotFoundError(targetActionId)

    await this.taskRepo.updateActionId(taskId, targetActionId, position)

    await this.eventBus.publish('task:moved', {
      taskId,
      targetActionId,
      position,
    })
  }
}
