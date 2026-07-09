import type { ActionRepository } from '../../ports/action-repository.port'
import type { TaskRepository } from '../../ports/task-repository.port'

export class GetStatisticsUseCase {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute() {
    const actions = await this.actionRepo.findAll()
    const actionIds = actions.map((a) => a.id)
    const tasks = await this.taskRepo.findByActionIds(actionIds)

    return actions.map((action) => ({
      actionId: action.id,
      actionTitle: action.title,
      taskCount: tasks.filter((t) => t.actionId === action.id).length,
    }))
  }
}
