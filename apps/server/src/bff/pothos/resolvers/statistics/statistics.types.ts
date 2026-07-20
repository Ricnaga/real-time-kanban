import { builder } from '@/bff/pothos/builder';
import { ColumnStatsDomain } from '@/bff/domain/statistics';
import { BoardStatisticsDomain } from '@/bff/domain/statistics';

export const ColumnStats = builder.objectRef<ColumnStatsDomain>('ColumnStats');

ColumnStats.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    step: t.exposeString('step'),
    taskCount: t.exposeInt('taskCount'),
  }),
});

export const BoardStatistics =
  builder.objectRef<BoardStatisticsDomain>('BoardStatistics');

BoardStatistics.implement({
  fields: (t) => ({
    columns: t.field({
      type: [ColumnStats],
      resolve: (parent) => parent.columns,
    }),
    totalTasks: t.exposeInt('totalTasks'),
  }),
});
