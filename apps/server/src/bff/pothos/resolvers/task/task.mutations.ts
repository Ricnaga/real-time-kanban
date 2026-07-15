import { builder } from '@/bff/pothos/builder';
import type { Context } from '@/bff/context';
import { Task } from './task.types';

builder.mutationField('createTask', (t) =>
  t.field({
    type: Task,
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      actionId: t.arg.id({ required: true }),
    },
    resolve: (_, args, ctx: Context) =>
      ctx.adapters.task.create({
        title: args.title,
        description: args.description ?? undefined,
        actionId: args.actionId,
      }),
  }),
);

builder.mutationField('updateTask', (t) =>
  t.field({
    type: Task,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
    },
    resolve: (_, args, ctx: Context) =>
      ctx.adapters.task.update({
        id: args.id,
        title: args.title ?? undefined,
        description: args.description ?? undefined,
      }),
  }),
);

builder.mutationField('deleteTask', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_, args, ctx: Context) => {
      await ctx.adapters.task.delete(args.id);
      return true;
    },
  }),
);

builder.mutationField('moveTask', (t) =>
  t.field({
    type: [Task],
    args: {
      taskId: t.arg.id({ required: true }),
      newPosition: t.arg.int({ required: true }),
      newActionId: t.arg.id({ required: false }),
    },
    resolve: (_, args, ctx: Context) =>
      ctx.adapters.task.move(
        args.taskId,
        args.newPosition,
        args.newActionId ?? undefined,
      ),
  }),
);
