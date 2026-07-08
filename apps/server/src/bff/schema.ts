import './objects/scalars'
import './objects/card.object'
import './objects/column.object'
import './objects/board.object'
import './queries/board.queries'
import './mutations/board.mutations'
import './subscriptions/board.subscriptions'
import { builder } from './builder'

export const schema = builder.toSchema()
