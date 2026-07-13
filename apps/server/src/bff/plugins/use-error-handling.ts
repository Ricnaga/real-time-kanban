import { GraphQLError } from 'graphql';
import type { MaskError } from 'graphql-yoga';
import { AppError } from '@/backend/shared/errors';

export const maskError: MaskError = (error) => {
  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: { statusCode: error.statusCode },
    });
  }

  return new GraphQLError('Internal server error', {
    extensions: { statusCode: 500 },
  });
};
