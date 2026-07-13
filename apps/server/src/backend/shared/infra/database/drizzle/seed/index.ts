import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { createConsola } from 'consola';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seedActions } from './action.seed';

const logger = createConsola({ level: 4 });

export async function createSeeds(db: NodePgDatabase<Record<string, never>>) {
  await seedActions(db);
}

const db = drizzle(process.env.DATABASE_URL!);

createSeeds(db)
  .then(() => logger.success('Seeds completed!'))
  .catch((err) => {
    logger.error('Seed failed:', err);
    process.exit(1);
  });
