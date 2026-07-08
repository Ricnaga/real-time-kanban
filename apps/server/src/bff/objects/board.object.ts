import { builder } from '../builder'
import { ColumnType } from './column.object'

export const BoardType = builder.objectRef<{
  id: string
  title: string
  columns: Array<{
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
  }>
  createdAt: Date
  updatedAt: Date
}>('Board')

BoardType.implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    columns: t.expose('columns', { type: [ColumnType] }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})
