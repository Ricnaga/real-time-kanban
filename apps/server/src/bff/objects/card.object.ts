import { builder } from '../builder'

export const CardType = builder.objectRef<{
  id: string
  title: string
  description: string | null
  position: number
  columnId: string
  createdAt: Date
  updatedAt: Date
}>('Card')

CardType.implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    position: t.exposeInt('position'),
    columnId: t.exposeString('columnId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})
