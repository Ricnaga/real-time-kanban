export class TaskDescription {
  public static readonly MAX_LENGTH = 500;

  public readonly value: string | null;

  constructor(value?: string | null) {
    if (!value || value.trim().length === 0) {
      this.value = null;
      return;
    }

    const trimmed = value.trim();

    if (trimmed.length > TaskDescription.MAX_LENGTH) {
      this.value = trimmed.slice(0, TaskDescription.MAX_LENGTH);
      return;
    }

    this.value = trimmed;
  }

  equals(other: TaskDescription): boolean {
    return this.value === other.value;
  }
}
