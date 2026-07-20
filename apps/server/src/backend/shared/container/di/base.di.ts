import { Container } from 'inversify';
import { TYPES } from './types';
import { drizzleDB } from '@/backend/shared/infra/database/drizzle/drizzle.database';
import { createPubSub } from '@/backend/shared/infra/pubsub';
import { createCache } from '@/backend/shared/infra/cache';
import type { ICacheService } from '@/backend/shared/interfaces';
import type { IActionRepository } from '@/backend/modules/action/repositories/action-repository.interface';
import { DrizzleActionRepository } from '@/backend/modules/action/infra/action-repository.drizzle';
import { CachedActionRepository } from '@/backend/modules/action/infra/action-repository.cache';
import type { ITaskRepository } from '@/backend/modules/task/repositories/task-repository.interface';
import { DrizzleTaskRepository } from '@/backend/modules/task/infra/task-repository.drizzle';
import { CachedTaskRepository } from '@/backend/modules/task/infra/task-repository.cache';

const container = new Container();

container.bind(TYPES.Database).toConstantValue(drizzleDB);
container
  .bind(TYPES.PubSub)
  .toDynamicValue(() => createPubSub())
  .inSingletonScope();

const cacheService = createCache();

container.bind<ICacheService>(TYPES.Cache).toConstantValue(cacheService);

const actionRepo = new DrizzleActionRepository(drizzleDB);
container
  .bind<IActionRepository>(TYPES.Repositories.Action)
  .toConstantValue(new CachedActionRepository(actionRepo, cacheService));

const taskRepo = new DrizzleTaskRepository(drizzleDB);
container
  .bind<ITaskRepository>(TYPES.Repositories.Task)
  .toConstantValue(new CachedTaskRepository(taskRepo, cacheService));

export default container;
