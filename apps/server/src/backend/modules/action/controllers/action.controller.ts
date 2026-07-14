import { injectable, inject } from 'inversify';
import { BaseController } from '@/backend/shared/controllers';
import type { CreateActionDTO } from '../dto/create.dto';
import type { UpdateActionDTO } from '../dto/update.dto';
import { CreateActionUseCase } from '../use-cases/create-action.use-case';
import { FindActionByIdUseCase } from '../use-cases/find-action-by-id.use-case';
import { ListActionsUseCase } from '../use-cases/list-actions.use-case';
import { UpdateActionUseCase } from '../use-cases/update-action.use-case';
import { DeleteActionUseCase } from '../use-cases/delete-action.use-case';
import { MoveActionUseCase } from '../use-cases/move-action.use-case';

@injectable()
export class ActionController extends BaseController {
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
    @inject(MoveActionUseCase)
    private readonly moveUseCase: MoveActionUseCase,
  ) {
    super();
  }

  async create(dto: CreateActionDTO) {
    return this.execute(() => this.createUseCase.execute(dto));
  }

  async findAll() {
    return this.execute(() => this.listUseCase.execute());
  }

  async findById(actionId: string) {
    return this.execute(() => this.findByIdUseCase.execute(actionId));
  }

  async update(dto: UpdateActionDTO) {
    return this.execute(() => this.updateUseCase.execute(dto));
  }

  async delete(actionId: string) {
    return this.execute(() => this.deleteUseCase.execute(actionId));
  }

  async move(actionId: string, newPosition: number) {
    return this.execute(() => this.moveUseCase.execute(actionId, newPosition));
  }
}
