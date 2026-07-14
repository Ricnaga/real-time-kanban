import { builder } from '@/bff/pothos/builder';
import { Action } from './action.types';

builder.queryFields((t) => ({
  actions: t.field({
    type: [Action],
    resolve: (_, __, ctx) => ctx.adapters.action.findAll(),
  }),
}));
