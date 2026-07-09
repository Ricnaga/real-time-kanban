import type { ActionRepository } from '../../ports/action-repository.port'
import type { TaskRepository } from '../../ports/task-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'
import { Task } from '../entities/task.entity'
import { NoActionsAvailableError } from '../entities/errors'

export class CreateTaskUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(title: string, description: string | null, actionId?: string) {
    const actions = await this.actionRepo.findAll()
    if (actions.length === 0) throw new NoActionsAvailableError()

    const targetAction = actionId
      ? actions.find((a) => a.id === actionId)
      : actions[0]

    if (!targetAction) throw new NoActionsAvailableError()

    const tasks = await this.taskRepo.findByActionIds([targetAction.id])
    const now = new Date()

    const task = new Task(
      crypto.randomUUID(),
      title,
      description,
      tasks.length,
      targetAction.id,
      now,
      now,
    )

    await this.taskRepo.save(task)

    await this.eventBus.publish('task:created', {
      taskId: task.id,
      actionId: targetAction.id,
    })
  }
}
