import { Container } from 'inversify';
import { TYPES } from './types';
import { drizzleDB } from '@/backend/shared/infra/database/drizzle/drizzle.database';
import { createPubSub } from '@/backend/shared/infra/pubsub';
import type { IActionRepository } from '@/backend/modules/action/repositories/action-repository.interface';
import { DrizzleActionRepository } from '@/backend/modules/action/infra/action-repository.drizzle';
import type { ITaskRepository } from '@/backend/modules/task/repositories/task-repository.interface';
import { DrizzleTaskRepository } from '@/backend/modules/task/infra/task-repository.drizzle';

const container = new Container();

container.bind(TYPES.Database).toConstantValue(drizzleDB);
container
  .bind(TYPES.PubSub)
  .toDynamicValue(() => createPubSub())
  .inSingletonScope();

container
  .bind<IActionRepository>(TYPES.Repositories.Action)
  .toDynamicValue(() => new DrizzleActionRepository(drizzleDB))
  .inSingletonScope();

container
  .bind<ITaskRepository>(TYPES.Repositories.Task)
  .toDynamicValue(() => new DrizzleTaskRepository(drizzleDB))
  .inSingletonScope();

export default container;
