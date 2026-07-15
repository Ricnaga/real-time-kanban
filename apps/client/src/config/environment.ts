import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:4000/graphql'),
  NEXT_PUBLIC_WS_URL: z.string().url().default('ws://localhost:4000/graphql'),
});

export type Environment = z.infer<typeof envSchema>;

let instance: Environment | undefined;

export function loadEnvironment(): Environment {
  if (instance) return instance;

  instance = envSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  });

  return instance;
}
