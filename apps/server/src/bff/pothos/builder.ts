import SchemaBuilder from '@pothos/core'
import type { Adapters } from '../adapters'

export type Context = {
  adapters: Adapters
  pubSub: {
    subscribe: (topic: string) => AsyncIterable<unknown>
    publish: (topic: string, payload: unknown) => void
  }
}

export const builder = new SchemaBuilder<{
  Context: Context
  Scalars: {
    DateTime: { Input: Date; Output: Date }
  }
}>({})

builder.queryType({})
builder.mutationType({})
builder.subscriptionType({})
