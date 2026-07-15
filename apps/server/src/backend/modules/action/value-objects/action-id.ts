import { Uuid } from '@/backend/shared/value-objects/uuid';

export class ActionId extends Uuid {
  constructor(value?: string) {
    super(value);
  }
}
