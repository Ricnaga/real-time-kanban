import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/backend/shared/infra/database/drizzle/drizzle.schema.ts',
  out: './src/backend/shared/infra/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
