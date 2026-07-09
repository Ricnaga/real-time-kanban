import { builder } from '../builder'
import { ActionType } from '../objects/action.object'

builder.mutationFields((t) => ({
  createAction: t.field({
    type: [ActionType],
    args: {
      title: t.arg.string({ required: true }),
      position: t.arg.int({ required: false }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.createAction(args.title, args.position ?? undefined),
  }),

  deleteAction: t.field({
    type: [ActionType],
    args: {
      actionId: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.deleteAction(args.actionId),
  }),

  reorderAction: t.field({
    type: [ActionType],
    args: {
      actionId: t.arg.string({ required: true }),
      newPosition: t.arg.int({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.reorderAction(args.actionId, args.newPosition),
  }),
}))
