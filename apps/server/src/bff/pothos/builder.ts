import SchemaBuilder from '@pothos/core';
import type { Context } from '@/bff/context';

export const builder = new SchemaBuilder<{
  Context: Context;
}>({});

builder.queryType({});
builder.mutationType({});
