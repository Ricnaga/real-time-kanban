import { builder } from '../builder'
import { ActionType } from '../objects/action.object'

builder.mutationFields((t) => ({
  moveTask: t.field({
    type: [ActionType],
    args: {
      taskId: t.arg.string({ required: true }),
      targetActionId: t.arg.string({ required: true }),
      position: t.arg.int({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.moveTask(
        args.taskId,
        args.targetActionId,
        args.position,
      ),
  }),

  createTask: t.field({
    type: [ActionType],
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      actionId: t.arg.string({ required: false }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.createTask(
        args.title,
        args.description ?? null,
        args.actionId ?? undefined,
      ),
  }),

  updateTask: t.field({
    type: [ActionType],
    args: {
      taskId: t.arg.string({ required: true }),
      title: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.updateTask(
        args.taskId,
        args.title ?? undefined,
        args.description ?? undefined,
      ),
  }),

  deleteTask: t.field({
    type: [ActionType],
    args: {
      taskId: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) =>
      ctx.kanbanController.deleteTask(args.taskId),
  }),
}))
