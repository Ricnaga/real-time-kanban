import { Uuid } from '@/backend/shared/value-objects/uuid';

export class TaskId extends Uuid {
  constructor(value?: string) {
    super(value);
  }
}
