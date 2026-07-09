import { builder } from '../builder'
import { ActionType } from '../objects/action.object'

builder.subscriptionField('actionsUpdated', (t) =>
  t.field({
    type: [ActionType],
    subscribe: (_, __, ctx) => ctx.pubSub.subscribe('actions:updated'),
    resolve: (payload) => payload as never,
  }),
)
