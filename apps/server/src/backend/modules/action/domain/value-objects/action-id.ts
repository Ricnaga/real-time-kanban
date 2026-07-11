export class ActionId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  constructor(public readonly value: string) {
    if (!value) throw new Error('ActionId required')
    if (!ActionId.UUID_REGEX.test(value)) {
      throw new Error('ActionId must be a valid UUID')
    }
  }

  equals(other: ActionId): boolean {
    return this.value === other.value
  }
}
