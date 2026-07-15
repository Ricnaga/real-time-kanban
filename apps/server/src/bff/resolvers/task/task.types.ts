import { builder } from '@/bff/pothos/builder';
import { TaskDomain } from '@/bff/domain/task/task.domain';

export const Task = builder.objectRef<TaskDomain>('Task');

Task.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    position: t.exposeInt('position'),
    actionId: t.exposeID('actionId'),
    createdAt: t.field({
      type: 'Date',
      resolve: (parent) => parent.createdAt,
    }),
    updatedAt: t.field({
      type: 'Date',
      resolve: (parent) => parent.updatedAt,
    }),
  }),
});
