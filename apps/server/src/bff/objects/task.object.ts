import { builder } from '../builder'

export const TaskType = builder.objectRef<{
  id: string
  title: string
  description: string | null
  position: number
  actionId: string
  createdAt: Date
  updatedAt: Date
}>('Task')

TaskType.implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    position: t.exposeInt('position'),
    actionId: t.exposeString('actionId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})
