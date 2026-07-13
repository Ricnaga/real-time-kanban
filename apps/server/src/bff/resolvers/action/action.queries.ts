import { builder } from '@/bff/pothos/builder';
import type { Context } from '@/bff/context';
import { Action } from './action.types';

builder.queryFields((t) => ({
  actions: t.field({
    type: [Action],
    resolve: (_, __, ctx: Context) => ctx.adapters.action.findAll(),
  }),
}));
