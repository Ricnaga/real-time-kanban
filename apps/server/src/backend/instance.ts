import 'reflect-metadata';
import type { StatusLine } from '@/utils/server.logs';
import { loadEnvironment } from '@/config';
import { drizzleDB } from '@/backend/shared/infra/database/drizzle/drizzle.database';
import { sql } from 'drizzle-orm';
import '@/backend/shared/container';
import container from '@/backend/shared/container';
import { ActionController } from '@/backend/modules/action/controllers/action.controller';

async function validateDatabase(): Promise<'online' | 'offline'> {
  try {
    await drizzleDB.execute(sql`SELECT 1`);
    return 'online';
  } catch {
    return 'offline';
  }
}

async function validateRedis(url: string): Promise<'online' | 'offline'> {
  try {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis(url, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    });

    await new Promise<void>((resolve, reject) => {
      redis.once('ready', () => resolve());
      redis.once('error', (err) => reject(err));
    });

    await redis.quit();
    return 'online';
  } catch {
    return 'offline';
  }
}

function validateDI(): 'online' | 'offline' {
  try {
    container.get(ActionController);
    return 'online';
  } catch {
    return 'offline';
  }
}

export async function initInstance(): Promise<StatusLine[]> {
  const { REDIS_URL } = loadEnvironment();

  const [dbStatus, redisStatus] = await Promise.all([
    validateDatabase(),
    REDIS_URL ? validateRedis(REDIS_URL) : Promise.resolve('offline' as const),
  ]);

  const diStatus = validateDI();

  return [
    { label: 'DATABASE', status: dbStatus },
    { label: 'REDIS', status: redisStatus },
    { label: 'BACKEND', status: diStatus },
  ];
}
