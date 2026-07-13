import { injectable, inject } from 'inversify';
import type { CreateActionDTO } from '../dto/create.dto';
import type { UpdateActionDTO } from '../dto/update.dto';
import { CreateActionUseCase } from '../use-cases/create-action.use-case';
import { FindActionByIdUseCase } from '../use-cases/find-action-by-id.use-case';
import { ListActionsUseCase } from '../use-cases/list-actions.use-case';
import { UpdateActionUseCase } from '../use-cases/update-action.use-case';
import { DeleteActionUseCase } from '../use-cases/delete-action.use-case';

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

  async create(dto: CreateActionDTO) {
    return this.createUseCase.execute(dto.title, dto.step);
  }

  async findAll() {
    return this.listUseCase.execute();
  }

  async findById(actionId: string) {
    return this.findByIdUseCase.execute(actionId);
  }

  async update(dto: UpdateActionDTO) {
    return this.updateUseCase.execute(dto.id, {
      title: dto.title,
      step: dto.step,
    });
  }

  async delete(actionId: string) {
    return this.deleteUseCase.execute(actionId);
  }
}
