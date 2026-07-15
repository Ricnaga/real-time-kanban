import { builder } from '@/bff/pothos/builder';
import type { Context } from '@/bff/context';
import { Task } from './task.types';
import type { TaskDomain } from '@/bff/domain/task/task.domain';

builder.subscriptionField('taskCreated', (t) =>
  t.field({
    type: Task,
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('TASK_CREATED'),
    resolve: (payload) => payload as TaskDomain,
  }),
);

builder.subscriptionField('taskUpdated', (t) =>
  t.field({
    type: Task,
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('TASK_UPDATED'),
    resolve: (payload) => payload as TaskDomain,
  }),
);

builder.subscriptionField('taskDeleted', (t) =>
  t.field({
    type: 'ID',
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('TASK_DELETED'),
    resolve: (payload) => payload as string,
  }),
);

builder.subscriptionField('taskMoved', (t) =>
  t.field({
    type: [Task],
    subscribe: (_, __, ctx: Context) => ctx.pubSub.subscribe('TASK_MOVED'),
    resolve: (payload) => payload as TaskDomain[],
  }),
);
