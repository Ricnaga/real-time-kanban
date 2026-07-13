import { Container } from 'inversify';
import { TYPES } from './types';
import { drizzleDB } from '@/backend/shared/infra/database/drizzle/drizzle.database';
import type { IActionRepository } from '@/backend/modules/action/repositories/action-repository.interface';
import { DrizzleActionRepository } from '@/backend/modules/action/infra/action-repository.drizzle';

const container = new Container();

container.bind(TYPES.Database).toConstantValue(drizzleDB);

container
  .bind<IActionRepository>(TYPES.Repositories.Action)
  .toDynamicValue(() => new DrizzleActionRepository(drizzleDB))
  .inSingletonScope();

export default container;
