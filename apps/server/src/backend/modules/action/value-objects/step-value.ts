import { AppError } from '@/backend/shared/errors';

export class StepValue {
  public static readonly MAX_LENGTH = 50;

  public readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new AppError(400, 'Step não pode ser vazio');
    }

    if (trimmed.length > StepValue.MAX_LENGTH) {
      throw new AppError(
        400,
        `Step não pode ter mais de ${StepValue.MAX_LENGTH} caracteres`,
      );
    }

    this.value = trimmed;
  }

  equals(other: StepValue): boolean {
    return this.value === other.value;
  }
}
