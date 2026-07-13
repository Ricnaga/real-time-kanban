import { v4 as uuid } from 'uuid';

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
      throw new Error('ActionId must be a valid UUID');
    }

    this.value = value;
  }

  equals(other: ActionId): boolean {
    return this.value === other.value;
  }
}
