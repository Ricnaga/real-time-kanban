import { builder } from '../builder'
import { ActionStatsType } from '../objects/statistics.object'

builder.queryFields((t) => ({
  actionStats: t.field({
    type: [ActionStatsType],
    resolve: async (_, __, ctx) => ctx.kanbanController.getStatistics(),
  }),
}))
