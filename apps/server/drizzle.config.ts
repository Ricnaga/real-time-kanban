import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/backend/infra/database/drizzle/schema.ts',
  out: './src/backend/infra/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
