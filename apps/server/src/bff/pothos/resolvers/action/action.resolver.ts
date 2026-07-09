import { builder } from '../../builder'
import { ActionTypeRef } from './action.types'

builder.queryFields((t) => ({
  actions: t.field({
    type: [ActionTypeRef],
    resolve: async (_, __, ctx) => ctx.adapters.action.getAll(),
  }),
}))

builder.mutationFields((t) => ({
  createAction: t.field({
    type: [ActionTypeRef],
    args: {
      title: t.arg.string({ required: true }),
      position: t.arg.int({ required: false }),
    },
    resolve: async (_, args, ctx) =>
      ctx.adapters.action.create(args.title, args.position ?? undefined),
  }),

  deleteAction: t.field({
    type: [ActionTypeRef],
    args: {
      actionId: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => ctx.adapters.action.remove(args.actionId),
  }),

  reorderAction: t.field({
    type: [ActionTypeRef],
    args: {
      actionId: t.arg.string({ required: true }),
      newPosition: t.arg.int({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.adapters.action.reorder(args.actionId, args.newPosition),
  }),
}))

builder.subscriptionField('actionsUpdated', (t) =>
  t.field({
    type: [ActionTypeRef],
    subscribe: (_, __, ctx) => ctx.pubSub.subscribe('actions:updated'),
    resolve: (payload) => payload as never,
  }),
)
