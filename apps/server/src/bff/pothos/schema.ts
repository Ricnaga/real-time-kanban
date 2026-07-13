import { builder } from './builder';
import '@/bff/resolvers';

export const schema = builder.toSchema();
