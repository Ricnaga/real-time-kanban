import './objects/scalars'
import './objects/task.object'
import './objects/action.object'
import './objects/statistics.object'
import './queries/actions.queries'
import './queries/statistics.queries'
import './mutations/task.mutations'
import './mutations/action.mutations'
import './subscriptions/kanban.subscriptions'
import { builder } from './builder'

export const schema = builder.toSchema()
