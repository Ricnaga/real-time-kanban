import { builder } from '@/bff/pothos/builder';
import { ActionDomain } from '@/bff/domain/action/action.domain';

export const Action = builder.objectRef<ActionDomain>('Action');

Action.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    step: t.exposeString('step'),
    position: t.exposeInt('position'),
  }),
});
