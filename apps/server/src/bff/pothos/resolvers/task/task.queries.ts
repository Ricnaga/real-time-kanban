import { builder } from '@/bff/pothos/builder';
import { Task } from './task.types';

builder.queryFields((t) => ({
  tasksByAction: t.field({
    type: [Task],
    args: {
      actionId: t.arg.id({ required: true }),
    },
    resolve: (_, args, ctx) => ctx.adapters.task.findByActionId(args.actionId),
  }),
  task: t.field({
    type: Task,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_, args, ctx) => ctx.adapters.task.findById(args.id),
  }),
}));
