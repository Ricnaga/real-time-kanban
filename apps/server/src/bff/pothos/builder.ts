import SchemaBuilder from '@pothos/core'

export type Context = Record<string, never>

export const builder = new SchemaBuilder<{
  Context: Context
}>({})

builder.queryType({})
