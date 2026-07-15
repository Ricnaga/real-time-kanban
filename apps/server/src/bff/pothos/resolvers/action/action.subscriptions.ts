import { builder } from '@/bff/pothos/builder';
import type { Context } from '@/bff/context';
import { Action } from './action.types';
import type { ActionDomain } from '@/bff/domain/action/action.domain';

builder.subscriptionField('actionCreated', (t) =>
  t.field({
    type: Action,
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('ACTION_CREATED'),
    resolve: (payload) => payload as ActionDomain,
  }),
);

builder.subscriptionField('actionUpdated', (t) =>
  t.field({
    type: Action,
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('ACTION_UPDATED'),
    resolve: (payload) => payload as ActionDomain,
  }),
);

builder.subscriptionField('actionDeleted', (t) =>
  t.field({
    type: 'ID',
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('ACTION_DELETED'),
    resolve: (payload) => payload as string,
  }),
);

builder.subscriptionField('actionMoved', (t) =>
  t.field({
    type: [Action],
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('ACTION_MOVED'),
    resolve: (payload) => payload as ActionDomain[],
  }),
);
