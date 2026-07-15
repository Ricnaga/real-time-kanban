import { z } from 'zod';

export const actionModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  step: z.string(),
  position: z.number(),
});

export type ActionModel = z.infer<typeof actionModelSchema>;
