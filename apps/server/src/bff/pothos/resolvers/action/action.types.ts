import { builder } from '../../builder'
import { Action } from '../../../domain/action.domain'

const TaskTypeRef = builder
  .objectRef<{
    id: string
    title: string
    description: string | null
    position: number
    actionId: string
    createdAt: Date
    updatedAt: Date
  }>('Task')
  .implement({
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

export const ActionTypeRef = builder.objectRef<Action>(Action.name).implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    position: t.exposeInt('position'),
    isDefault: t.exposeBoolean('isDefault'),
    tasks: t.expose('tasks', { type: [TaskTypeRef] }),
  }),
})
