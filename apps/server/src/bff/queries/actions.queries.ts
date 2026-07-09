import { builder } from '../builder'
import { ActionType } from '../objects/action.object'

builder.queryFields((t) => ({
  actions: t.field({
    type: [ActionType],
    resolve: async (_, __, ctx) => ctx.kanbanController.getActions(),
  }),
}))
