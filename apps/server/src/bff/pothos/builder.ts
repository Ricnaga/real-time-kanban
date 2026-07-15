import SchemaBuilder from '@pothos/core';
import { DateResolver } from 'graphql-scalars';
import type { Context } from '@/bff/context';

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.addScalarType('Date', DateResolver, {});

builder.queryType({});
builder.mutationType({});
