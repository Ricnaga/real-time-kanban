import type { TaskRepository } from '../../ports/task-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { TaskNotFoundError } from '../entities/errors'

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(taskId: string) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) throw new TaskNotFoundError(taskId)

    await this.taskRepo.delete(taskId)

    await this.eventBus.publish('task:deleted', { taskId })
  }
}
