import type { TaskRepository } from '../../ports/task-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { TaskNotFoundError } from '../entities/errors'

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(taskId: string, title?: string, description?: string) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) throw new TaskNotFoundError(taskId)

    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    task.updatedAt = new Date()

    await this.taskRepo.save(task)

    await this.eventBus.publish('task:updated', { taskId })
  }
}
