import { builder } from './builder';

builder.queryFields((t) => ({
  _empty: t.field({
    type: 'String',
    resolve: () => 'placeholder',
  }),
}));

export const schema = builder.toSchema();
