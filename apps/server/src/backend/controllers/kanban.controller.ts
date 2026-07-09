import type { ActionRepository } from '../ports/action-repository.port'
import type { TaskRepository } from '../ports/task-repository.port'
import type { EventPublisher } from '../ports/event-publisher.port'
import type { MoveTaskUseCase } from '../domain/use-cases/move-task.use-case'
import type { CreateTaskUseCase } from '../domain/use-cases/create-task.use-case'
import type { UpdateTaskUseCase } from '../domain/use-cases/update-task.use-case'
import type { DeleteTaskUseCase } from '../domain/use-cases/delete-task.use-case'
import type { CreateActionUseCase } from '../domain/use-cases/create-action.use-case'
import type { DeleteActionUseCase } from '../domain/use-cases/delete-action.use-case'
import type { ReorderActionUseCase } from '../domain/use-cases/reorder-action.use-case'
import type { GetStatisticsUseCase } from '../domain/use-cases/get-statistics.use-case'
import { Action } from '../domain/entities/action.entity'

const DEFAULT_ACTIONS = [
  'Aguardando',
  'Em Desenvolvimento',
  'Em Revisão',
  'Em Deploy',
  'Concluída',
]

export type ActionWithTasksDTO = {
  id: string
  title: string
  position: number
  isDefault: boolean
  tasks: Array<{
    id: string
    title: string
    description: string | null
    position: number
    actionId: string
    createdAt: Date
    updatedAt: Date
  }>
}

export class KanbanController {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly taskRepo: TaskRepository,
    private readonly eventBus: EventPublisher,
    private readonly moveTaskUseCase: MoveTaskUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly createActionUseCase: CreateActionUseCase,
    private readonly deleteActionUseCase: DeleteActionUseCase,
    private readonly reorderActionUseCase: ReorderActionUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  async seed() {
    const existing = await this.actionRepo.findAll()
    if (existing.length > 0) return

    for (let i = 0; i < DEFAULT_ACTIONS.length; i++) {
      const action = new Action(
        crypto.randomUUID(),
        DEFAULT_ACTIONS[i],
        i,
        true,
      )
      await this.actionRepo.save(action)
    }
  }

  async getActions(): Promise<ActionWithTasksDTO[]> {
    return this.loadActionsWithTasks()
  }

  async moveTask(
    taskId: string,
    targetActionId: string,
    position: number,
  ): Promise<ActionWithTasksDTO[]> {
    await this.moveTaskUseCase.execute(taskId, targetActionId, position)
    return this.publishAndReturn()
  }

  async createTask(
    title: string,
    description: string | null,
    actionId?: string,
  ): Promise<ActionWithTasksDTO[]> {
    await this.createTaskUseCase.execute(title, description, actionId)
    return this.publishAndReturn()
  }

  async updateTask(
    taskId: string,
    title?: string,
    description?: string,
  ): Promise<ActionWithTasksDTO[]> {
    await this.updateTaskUseCase.execute(taskId, title, description)
    return this.publishAndReturn()
  }

  async deleteTask(taskId: string): Promise<ActionWithTasksDTO[]> {
    await this.deleteTaskUseCase.execute(taskId)
    return this.publishAndReturn()
  }

  async createAction(
    title: string,
    position?: number,
  ): Promise<ActionWithTasksDTO[]> {
    await this.createActionUseCase.execute(title, position)
    return this.publishAndReturn()
  }

  async deleteAction(actionId: string): Promise<ActionWithTasksDTO[]> {
    await this.deleteActionUseCase.execute(actionId)
    return this.publishAndReturn()
  }

  async reorderAction(
    actionId: string,
    newPosition: number,
  ): Promise<ActionWithTasksDTO[]> {
    await this.reorderActionUseCase.execute(actionId, newPosition)
    return this.publishAndReturn()
  }

  async getStatistics() {
    return this.getStatisticsUseCase.execute()
  }

  private async publishAndReturn(): Promise<ActionWithTasksDTO[]> {
    const data = await this.loadActionsWithTasks()
    await this.eventBus.publish('actions:updated', data)
    return data
  }

  private async loadActionsWithTasks(): Promise<ActionWithTasksDTO[]> {
    const actions = await this.actionRepo.findAll()
    const actionIds = actions.map((a) => a.id)
    const tasks = await this.taskRepo.findByActionIds(actionIds)

    return actions.map((a) => ({
      id: a.id,
      title: a.title,
      position: a.position,
      isDefault: a.isDefault,
      tasks: tasks
        .filter((t) => t.actionId === a.id)
        .map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          position: t.position,
          actionId: t.actionId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
    }))
  }
}
