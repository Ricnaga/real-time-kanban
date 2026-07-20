import container from './base.di';
import { GetStatisticsUseCase } from '@/backend/modules/statistics/use-cases/get-statistics.use-case';
import { StatisticsController } from '@/backend/modules/statistics/controllers/statistics.controller';

container.bind(GetStatisticsUseCase).toSelf().inSingletonScope();

container.bind(StatisticsController).toSelf().inSingletonScope();
