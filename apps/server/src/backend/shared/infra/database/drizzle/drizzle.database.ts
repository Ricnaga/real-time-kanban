import { loadEnvironment } from '@/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './drizzle.schema';

const env = loadEnvironment();

export const drizzleDB = drizzle(env.DATABASE_URL, { schema });
