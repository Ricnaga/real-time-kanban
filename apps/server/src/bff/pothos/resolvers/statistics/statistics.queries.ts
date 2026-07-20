import { builder } from '@/bff/pothos/builder';
import { BoardStatistics } from './statistics.types';

builder.queryFields((t) => ({
  boardStatistics: t.field({
    type: BoardStatistics,
    resolve: (_, __, ctx) => ctx.adapters.statistics.getBoardStats(),
  }),
}));
