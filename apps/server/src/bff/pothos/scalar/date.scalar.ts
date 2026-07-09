import { builder } from '../builder'

builder.scalarType('DateTime', {
  serialize: (value) => (value as Date).toISOString(),
  parseValue: (value) => new Date(value as string),
})
