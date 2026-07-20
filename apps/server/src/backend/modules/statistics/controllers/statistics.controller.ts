import { injectable, inject } from 'inversify';
import { BaseController } from '@/backend/shared/controllers';
import { GetStatisticsUseCase } from '../use-cases/get-statistics.use-case';

@injectable()
export class StatisticsController extends BaseController {
  constructor(
    @inject(GetStatisticsUseCase)
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {
    super();
  }

  async getBoardStats() {
    return this.execute(() => this.getStatisticsUseCase.execute());
  }
}
