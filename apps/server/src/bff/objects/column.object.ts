import { builder } from '../builder'
import { CardType } from './card.object'

export const ColumnType = builder.objectRef<{
  id: string
  title: string
  position: number
  cards: Array<{
    id: string
    title: string
    description: string | null
    position: number
    columnId: string
    createdAt: Date
    updatedAt: Date
  }>
}>('Column')

ColumnType.implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    position: t.exposeInt('position'),
    cards: t.expose('cards', { type: [CardType] }),
  }),
})
