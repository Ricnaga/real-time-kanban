import type { ITaskRepository } from '../repositories/task-repository.interface';
import type { ICacheService } from '@/backend/shared/interfaces';
import { Task } from '../entities/task';

type TaskCacheData = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  actionId: string;
  createdAt: string;
  updatedAt: string;
};

const CACHE_KEYS = {
  listByAction: (actionId: string) => `tasks:list:action:${actionId}`,
  detail: (id: string) => `tasks:detail:${id}`,
} as const;

const LIST_TTL = 60;
const DETAIL_TTL = 30;

export class CachedTaskRepository implements ITaskRepository {
  constructor(
    private readonly inner: ITaskRepository,
    private readonly cache: ICacheService,
  ) {}

  async create(task: Task): Promise<void> {
    await this.inner.create(task);
    await this.cache.del(CACHE_KEYS.listByAction(task.actionId));
  }

  async findAll(): Promise<Task[]> {
    return this.inner.findAll();
  }

  async findById(id: string): Promise<Task | null> {
    const cached = await this.cache.get<TaskCacheData>(CACHE_KEYS.detail(id));
    if (cached) return hydrateTask(cached);

    const result = await this.inner.findById(id);
    if (result) {
      await this.cache.set(
        CACHE_KEYS.detail(id),
        toCacheData(result),
        DETAIL_TTL,
      );
    }
    return result;
  }

  async findByActionId(actionId: string): Promise<Task[]> {
    const cached = await this.cache.get<TaskCacheData[]>(
      CACHE_KEYS.listByAction(actionId),
    );
    if (cached) return cached.map(hydrateTask);

    const result = await this.inner.findByActionId(actionId);
    await this.cache.set(
      CACHE_KEYS.listByAction(actionId),
      result.map(toCacheData),
      LIST_TTL,
    );
    return result;
  }

  async update(task: Task): Promise<void> {
    await this.inner.update(task);
    await Promise.all([
      this.cache.del(CACHE_KEYS.listByAction(task.actionId)),
      this.cache.del(CACHE_KEYS.detail(task.id)),
    ]);
  }

  async delete(id: string): Promise<void> {
    // Busca o task primeiro para obter o actionId (cache hit se use case acabou de ler)
    const task = await this.findById(id);

    await this.inner.delete(id);

    if (task) {
      await this.cache.del(CACHE_KEYS.listByAction(task.actionId));
    }
    await this.cache.del(CACHE_KEYS.detail(id));
  }

  async updatePositions(
    items: { id: string; position: number }[],
  ): Promise<void> {
    // Precisa invalidar o cache da lista antes de atualizar posições
    // Busca o actionId do primeiro item (todos pertencem à mesma action)
    const first = await this.inner.findById(items[0]?.id);

    await this.inner.updatePositions(items);

    if (first) {
      await this.cache.del(CACHE_KEYS.listByAction(first.actionId));
    }
  }

  async reindexAfterDelete(
    actionId: string,
    deletedPosition: number,
  ): Promise<void> {
    await this.inner.reindexAfterDelete(actionId, deletedPosition);
    await this.cache.del(CACHE_KEYS.listByAction(actionId));
  }

  async countByActionId(actionId: string): Promise<number> {
    return this.inner.countByActionId(actionId);
  }
}

function toCacheData(task: Task): TaskCacheData {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    position: task.position,
    actionId: task.actionId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function hydrateTask(data: TaskCacheData): Task {
  return new Task({
    id: data.id,
    title: data.title,
    description: data.description,
    position: data.position,
    actionId: data.actionId,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  });
}
