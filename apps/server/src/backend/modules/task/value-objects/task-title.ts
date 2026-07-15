import { AppError } from '@/backend/shared/errors';

export class TaskTitle {
  public static readonly MAX_LENGTH = 150;

  public readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new AppError(400, 'Título não pode ser vazio');
    }

    if (trimmed.length > TaskTitle.MAX_LENGTH) {
      throw new AppError(
        400,
        `Título não pode ter mais de ${TaskTitle.MAX_LENGTH} caracteres`,
      );
    }

    this.value = trimmed;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }
}
