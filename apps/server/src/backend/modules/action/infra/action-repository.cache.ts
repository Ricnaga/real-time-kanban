import type { IActionRepository } from '../repositories/action-repository.interface';
import type { ICacheService } from '@/backend/shared/interfaces';
import { Action } from '../entities/action';

type ActionCacheData = {
  id: string;
  title: string;
  step: string;
  position: number;
};

const CACHE_KEYS = {
  listAll: 'actions:list:all',
  detail: (id: string) => `actions:detail:${id}`,
} as const;

const LIST_TTL = 60;
const DETAIL_TTL = 30;

export class CachedActionRepository implements IActionRepository {
  constructor(
    private readonly inner: IActionRepository,
    private readonly cache: ICacheService,
  ) {}

  async create(action: Action): Promise<void> {
    await this.inner.create(action);
    await this.cache.del(CACHE_KEYS.listAll);
  }

  async findAll(): Promise<Action[]> {
    const cached = await this.cache.get<ActionCacheData[]>(CACHE_KEYS.listAll);
    if (cached) return cached.map((d) => new Action(d));

    const result = await this.inner.findAll();
    await this.cache.set(CACHE_KEYS.listAll, result.map(toCacheData), LIST_TTL);
    return result;
  }

  async findById(id: string): Promise<Action | null> {
    const cached = await this.cache.get<ActionCacheData>(CACHE_KEYS.detail(id));
    if (cached) return new Action(cached);

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

  async findByName(name: string): Promise<Action | null> {
    return this.inner.findByName(name);
  }

  async update(action: Action): Promise<void> {
    await this.inner.update(action);
    await Promise.all([
      this.cache.del(CACHE_KEYS.listAll),
      this.cache.del(CACHE_KEYS.detail(action.id)),
    ]);
  }

  async delete(id: string): Promise<void> {
    await this.inner.delete(id);
    await Promise.all([
      this.cache.del(CACHE_KEYS.listAll),
      this.cache.del(CACHE_KEYS.detail(id)),
    ]);
  }

  async updatePositions(
    items: { id: string; position: number }[],
  ): Promise<void> {
    await this.inner.updatePositions(items);
    await this.cache.del(CACHE_KEYS.listAll);
  }

  async reindexAfterDelete(deletedPosition: number): Promise<void> {
    await this.inner.reindexAfterDelete(deletedPosition);
    await this.cache.del(CACHE_KEYS.listAll);
  }

  async count(): Promise<number> {
    return this.inner.count();
  }
}

function toCacheData(action: Action): ActionCacheData {
  return {
    id: action.id,
    title: action.title,
    step: action.step,
    position: action.position,
  };
}
