import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import { AppError } from '@/backend/shared/errors';
import type { ITaskRepository } from '../repositories/task-repository.interface';
import type { UpdateTaskDTO } from '../dto/update.dto';

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(data: UpdateTaskDTO) {
    const task = await this.taskRepo.findById(data.id);
    if (!task) throw new AppError(404, 'Task não encontrada');

    if (data.title !== undefined) {
      task.title = data.title;
    }

    if (data.description !== undefined) {
      task.description = data.description;
    }

    if (data.position !== undefined) {
      task.position = data.position;
    }

    if (data.actionId !== undefined) {
      task.actionId = data.actionId;
    }

    await this.taskRepo.update(task);
    return task;
  }
}
