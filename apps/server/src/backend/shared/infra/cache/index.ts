import Redis from 'ioredis';
import { RedisCacheService } from './redis-cache';
import { MemoryCacheService } from './memory-cache';
import type { ICacheService } from '@/backend/shared/interfaces/cache.interface';
import { loadEnvironment } from '@/config';

let instance: ICacheService | undefined;

export function createCache(): ICacheService {
  if (instance) return instance;

  const { REDIS_URL } = loadEnvironment();

  if (REDIS_URL) {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null,
      lazyConnect: true,
    });

    // não trava se Redis estiver offline — cache será noop silencioso
    client.connect().catch(() => {});

    instance = new RedisCacheService(client);
  } else {
    instance = new MemoryCacheService();
  }

  return instance;
}
