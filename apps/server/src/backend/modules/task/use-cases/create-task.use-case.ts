import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { ITaskRepository } from '../repositories/task-repository.interface';
import type { CreateTaskDTO } from '../dto/create.dto';
import { Task } from '../entities/task';

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(data: CreateTaskDTO) {
    const position = await this.taskRepo.countByActionId(data.actionId);

    const task = new Task({
      title: data.title,
      description: data.description,
      position,
      actionId: data.actionId,
    });

    await this.taskRepo.create(task);
    return task;
  }
}
