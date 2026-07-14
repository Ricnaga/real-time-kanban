import { v4 as uuid } from 'uuid';
import { AppError } from '@/backend/shared/errors';

export class ActionId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  public readonly value: string;

  constructor(value?: string) {
    if (!value) {
      this.value = uuid();
      return;
    }

    if (!ActionId.UUID_REGEX.test(value)) {
      throw new AppError(400, 'ActionId deve ser um UUID válido');
    }

    this.value = value;
  }

  equals(other: ActionId): boolean {
    return this.value === other.value;
  }
}
