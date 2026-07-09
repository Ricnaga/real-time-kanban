import { builder } from '../builder'
import { TaskType } from './task.object'

export const ActionType = builder.objectRef<{
  id: string
  title: string
  position: number
  isDefault: boolean
  tasks: Array<{
    id: string
    title: string
    description: string | null
    position: number
    actionId: string
    createdAt: Date
    updatedAt: Date
  }>
}>('Action')

ActionType.implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    position: t.exposeInt('position'),
    isDefault: t.exposeBoolean('isDefault'),
    tasks: t.expose('tasks', { type: [TaskType] }),
  }),
})
