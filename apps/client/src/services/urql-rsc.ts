import { registerUrql } from '@urql/next/rsc';
import { makeClient } from './urql-client';

export const { getClient } = registerUrql(makeClient);
