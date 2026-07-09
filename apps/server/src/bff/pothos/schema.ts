import './scalar'
import './resolvers/action'
import { builder } from './builder'

export const schema = builder.toSchema()
