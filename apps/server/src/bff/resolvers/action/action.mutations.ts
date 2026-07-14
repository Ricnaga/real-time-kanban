import { builder } from '@/bff/pothos/builder';
import type { Context } from '@/bff/context';
import { Action } from './action.types';

builder.mutationField('createAction', (t) =>
  t.field({
    type: Action,
    args: {
      title: t.arg.string({ required: true }),
      step: t.arg.string({ required: true }),
    },
    resolve: (_, args, ctx: Context) =>
      ctx.adapters.action.create({
        title: args.title,
        step: args.step,
      }),
  }),
);

builder.mutationField('moveAction', (t) =>
  t.field({
    type: [Action],
    args: {
      actionId: t.arg.id({ required: true }),
      newPosition: t.arg.int({ required: true }),
    },
    resolve: (_, args, ctx: Context) =>
      ctx.adapters.action.move(args.actionId, args.newPosition),
  }),
);
