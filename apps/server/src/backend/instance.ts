import type { StatusLine } from '@/utils/server.logs';
import { loadEnvironment } from '@/config';
import { drizzleDB } from '@/backend/shared/infra/database/drizzle/drizzle.database';
import { sql } from 'drizzle-orm';

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

async function validateService(
  url: string,
  timeout = 3000,
): Promise<'online' | 'offline'> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    return response.ok ? 'online' : 'offline';
  } catch {
    return 'offline';
  }
}

export async function initInstance(): Promise<StatusLine[]> {
  const { REDIS_URL, PROMETHEUS_URL, GRAFANA_URL } = loadEnvironment();

  const [dbStatus, redisStatus, prometheusStatus, grafanaStatus] =
    await Promise.all([
      validateDatabase(),
      REDIS_URL
        ? validateRedis(REDIS_URL)
        : Promise.resolve('offline' as const),
      PROMETHEUS_URL
        ? validateService(PROMETHEUS_URL)
        : Promise.resolve('offline' as const),
      GRAFANA_URL
        ? validateService(GRAFANA_URL)
        : Promise.resolve('offline' as const),
    ]);

  return [
    { label: 'DATABASE', status: dbStatus },
    { label: 'REDIS', status: redisStatus },
    { label: 'PROMETHEUS', status: prometheusStatus },
    { label: 'GRAFANA', status: grafanaStatus },
  ];
}
