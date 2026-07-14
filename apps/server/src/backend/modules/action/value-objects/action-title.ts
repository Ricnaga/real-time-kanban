import { AppError } from '@/backend/shared/errors';

export class ActionTitle {
  public static readonly MAX_LENGTH = 100;

  public readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new AppError(400, 'Título não pode ser vazio');
    }

    if (trimmed.length > ActionTitle.MAX_LENGTH) {
      throw new AppError(
        400,
        `Título não pode ter mais de ${ActionTitle.MAX_LENGTH} caracteres`,
      );
    }

    this.value = trimmed;
  }

  equals(other: ActionTitle): boolean {
    return this.value === other.value;
  }
}
