import { AppError } from '../errors';

export abstract class BaseController {
  protected async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Internal server error');
    }
  }
}
