import { injectable, inject } from 'inversify';
import { BaseController } from '@/backend/shared/controllers';
import type { CreateTaskDTO } from '../dto/create.dto';
import type { UpdateTaskDTO } from '../dto/update.dto';
import type { MoveTaskDTO } from '../dto/move.dto';
import { CreateTaskUseCase } from '../use-cases/create-task.use-case';
import { FindTaskByIdUseCase } from '../use-cases/find-task-by-id.use-case';
import { ListTasksByActionUseCase } from '../use-cases/list-tasks-by-action.use-case';
import { UpdateTaskUseCase } from '../use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../use-cases/delete-task.use-case';
import { MoveTaskUseCase } from '../use-cases/move-task.use-case';

@injectable()
export class TaskController extends BaseController {
  constructor(
    @inject(CreateTaskUseCase)
    private readonly createUseCase: CreateTaskUseCase,
    @inject(FindTaskByIdUseCase)
    private readonly findByIdUseCase: FindTaskByIdUseCase,
    @inject(ListTasksByActionUseCase)
    private readonly listByActionUseCase: ListTasksByActionUseCase,
    @inject(UpdateTaskUseCase)
    private readonly updateUseCase: UpdateTaskUseCase,
    @inject(DeleteTaskUseCase)
    private readonly deleteUseCase: DeleteTaskUseCase,
    @inject(MoveTaskUseCase)
    private readonly moveUseCase: MoveTaskUseCase,
  ) {
    super();
  }

  async create(dto: CreateTaskDTO) {
    return this.execute(() => this.createUseCase.execute(dto));
  }

  async findById(taskId: string) {
    return this.execute(() => this.findByIdUseCase.execute(taskId));
  }

  async findByActionId(actionId: string) {
    return this.execute(() => this.listByActionUseCase.execute(actionId));
  }

  async update(dto: UpdateTaskDTO) {
    return this.execute(() => this.updateUseCase.execute(dto));
  }

  async delete(taskId: string) {
    return this.execute(() => this.deleteUseCase.execute(taskId));
  }

  async move(dto: MoveTaskDTO) {
    return this.execute(() => this.moveUseCase.execute(dto));
  }
}
