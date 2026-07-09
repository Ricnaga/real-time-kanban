import type { ActionWithTasksDTO } from '../../backend/controllers/kanban.controller'

type TaskDTO = ActionWithTasksDTO['tasks'][number]

export class Action {
  static readonly __typename = 'Action'

  readonly id: string
  readonly title: string
  readonly position: number
  readonly isDefault: boolean
  readonly tasks: TaskDTO[]

  constructor(dto: ActionWithTasksDTO) {
    this.id = dto.id
    this.title = dto.title
    this.position = dto.position
    this.isDefault = dto.isDefault
    this.tasks = dto.tasks
  }
}
