import { injectable, inject } from 'inversify';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IActionRepository } from '@/backend/modules/action/repositories/action-repository.interface';
import type { ITaskRepository } from '@/backend/modules/task/repositories/task-repository.interface';
import type { BoardStatisticsDTO, ColumnStatsDTO } from '@kanban/shared';

@injectable()
export class GetStatisticsUseCase {
  constructor(
    @inject(TYPES.Repositories.Action)
    private readonly actionRepo: IActionRepository,
    @inject(TYPES.Repositories.Task)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(): Promise<BoardStatisticsDTO> {
    const actions = await this.actionRepo.findAll();

    const columns: ColumnStatsDTO[] = await Promise.all(
      actions.map(async (action) => {
        const taskCount = await this.taskRepo.countByActionId(action.id);
        return {
          id: action.id,
          title: action.title,
          step: action.step,
          taskCount,
        };
      }),
    );

    const totalTasks = columns.reduce((sum, col) => sum + col.taskCount, 0);

    return { columns, totalTasks };
  }
}
