import { builder } from '../builder'
import { BoardType } from '../objects/board.object'

builder.subscriptionField('boardUpdated', (t) =>
  t.field({
    type: BoardType,
    subscribe: (_, __, ctx) => ctx.pubSub.subscribe('board:updated'),
    resolve: (payload) => payload as never,
  }),
)
