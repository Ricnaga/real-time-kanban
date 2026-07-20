import { GraphQLError } from 'graphql';
import type { MaskError } from 'graphql-yoga';
import { AppError } from '@kanban/shared';

export const maskError: MaskError = (error) => {
  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: { statusCode: error.statusCode },
    });
  }

  return new GraphQLError('Erro interno do servidor', {
    extensions: { statusCode: 500 },
  });
};
