import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgresql://localhost:5432/kanban'),
  PORT: z.coerce.number().default(4000),
  HIVE_TOKEN: z.string().optional(),
  HIVE_TARGET: z.string().optional(),
  REDIS_URL: z.string().optional(),
  PROMETHEUS_URL: z.string().optional(),
  GRAFANA_URL: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

export function loadEnvironment(): Environment {
  return envSchema.parse(process.env);
}
