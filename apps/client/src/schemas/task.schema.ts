import { z } from 'zod';

export const taskModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  position: z.number(),
  actionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TaskModel = z.infer<typeof taskModelSchema>;
