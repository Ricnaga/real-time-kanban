import { z } from 'zod';

export const columnStatsSchema = z.object({
  id: z.string(),
  title: z.string(),
  step: z.string(),
  taskCount: z.number(),
});

export const boardStatisticsSchema = z.object({
  columns: z.array(columnStatsSchema),
  totalTasks: z.number(),
});

export type ColumnStatsModel = z.infer<typeof columnStatsSchema>;
export type BoardStatisticsModel = z.infer<typeof boardStatisticsSchema>;
