import { builder } from '../builder'

export const ActionStatsType = builder.objectRef<{
  actionId: string
  actionTitle: string
  taskCount: number
}>('ActionStats')

ActionStatsType.implement({
  fields: (t) => ({
    actionId: t.exposeString('actionId'),
    actionTitle: t.exposeString('actionTitle'),
    taskCount: t.exposeInt('taskCount'),
  }),
})
