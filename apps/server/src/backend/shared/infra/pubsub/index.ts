import Redis from 'ioredis';
import { RedisPubSub } from './redis-pubsub';
import { MemoryPubSub } from './memory-pubsub';
import type { IPubSub } from '@/backend/shared/interfaces';
import { loadEnvironment } from '@/config';

let instance: IPubSub | undefined;

export function createPubSub(): IPubSub {
  if (instance) return instance;

  const { REDIS_URL } = loadEnvironment();

  if (REDIS_URL) {
    const publisher = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    });

    const subscriber = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    });

    instance = new RedisPubSub(publisher, subscriber);
  } else {
    instance = new MemoryPubSub();
  }

  return instance;
}
