import { builder } from '../builder'
import { BoardType } from '../objects/board.object'

builder.mutationFields((t) => ({
  createBoard: t.field({
    type: BoardType,
    args: { title: t.arg.string({ required: true }) },
    resolve: async (_, { title }, ctx) => ctx.boardController.create(title),
  }),

  moveCard: t.field({
    type: BoardType,
    args: {
      boardId: t.arg.string({ required: true }),
      cardId: t.arg.string({ required: true }),
      targetColumnId: t.arg.string({ required: true }),
      position: t.arg.int({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.boardController.moveCard(
        args.boardId,
        args.cardId,
        args.targetColumnId,
        args.position,
      ),
  }),
}))
