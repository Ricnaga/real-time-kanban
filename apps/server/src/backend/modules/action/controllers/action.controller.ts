import { injectable, inject } from 'inversify'
import type { Step } from '../domain/entities/action'
import { CreateActionUseCase } from '../use-cases/create-action.use-case'
import { FindActionByIdUseCase } from '../use-cases/find-action-by-id.use-case'
import { ListActionsUseCase } from '../use-cases/list-actions.use-case'
import { UpdateActionUseCase } from '../use-cases/update-action.use-case'
import { DeleteActionUseCase } from '../use-cases/delete-action.use-case'

@injectable()
export class ActionController {
  constructor(
    @inject(CreateActionUseCase)
    private readonly createUseCase: CreateActionUseCase,
    @inject(FindActionByIdUseCase)
    private readonly findByIdUseCase: FindActionByIdUseCase,
    @inject(ListActionsUseCase)
    private readonly listUseCase: ListActionsUseCase,
    @inject(UpdateActionUseCase)
    private readonly updateUseCase: UpdateActionUseCase,
    @inject(DeleteActionUseCase)
    private readonly deleteUseCase: DeleteActionUseCase,
  ) {}

  async create(title: string, step: Step) {
    return this.createUseCase.execute(title, step)
  }

  async findAll() {
    return this.listUseCase.execute()
  }

  async findById(actionId: string) {
    return this.findByIdUseCase.execute(actionId)
  }

  async update(actionId: string, data: { title?: string; step?: Step }) {
    return this.updateUseCase.execute(actionId, data)
  }

  async delete(actionId: string) {
    return this.deleteUseCase.execute(actionId)
  }
}
