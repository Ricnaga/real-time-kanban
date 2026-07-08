import { builder } from '../builder'
import { BoardType } from '../objects/board.object'

builder.queryFields((t) => ({
  boards: t.field({
    type: [BoardType],
    resolve: async (_, __, ctx) => ctx.boardController.list(),
  }),

  board: t.field({
    type: BoardType,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_, { id }, ctx) => {
      const boards = await ctx.boardController.list()
      const board = boards.find((b: { id: string }) => b.id === id)
      if (!board) throw new Error(`Board ${id} not found`)
      return board
    },
  }),
}))
