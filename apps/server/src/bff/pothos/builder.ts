import SchemaBuilder from '@pothos/core';
import { DateTimeResolver } from 'graphql-scalars';
import type { Context } from '@/bff/context';

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.addScalarType('DateTime', DateTimeResolver, {});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});
