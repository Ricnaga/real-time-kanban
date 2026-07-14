import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { createConsola } from 'consola';
import { actions } from '../drizzle.schema';

const logger = createConsola({ level: 4 });

const seeds = [
  { title: 'Configurar projeto', step: 'BACKLOG', position: 0 },
  { title: 'Criar layout da dashboard', step: 'IN_PROGRESS', position: 1 },
  { title: 'Revisar testes unitários', step: 'REVIEW', position: 2 },
  { title: 'Deploy do ambiente de staging', step: 'DEPLOY', position: 3 },
  { title: 'Documentar endpoints da API', step: 'DONE', position: 4 },
];

export async function seedActions(db: NodePgDatabase<Record<string, never>>) {
  logger.info('Seeding actions...');
  await db.insert(actions).values(seeds);
  logger.success(`Seeded ${seeds.length} actions.`);
}
