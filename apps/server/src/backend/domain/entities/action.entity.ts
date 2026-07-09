import { CannotDeleteDefaultActionError } from './errors'

export class Action {
  constructor(
    public readonly id: string,
    public title: string,
    public position: number,
    public isDefault: boolean = false,
  ) {}

  canDelete(): void {
    if (this.isDefault) {
      throw new CannotDeleteDefaultActionError(this.title)
    }
  }
}
