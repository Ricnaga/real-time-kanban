import { ActionId } from '../value-objects/action-id';
import { ActionTitle } from '../value-objects/action-title';
import { StepValue } from '../value-objects/step-value';

export interface IActionCreate {
  id?: string;
  title: string;
  step: string;
  position: number;
}

export class Action {
  public readonly id: ActionId;
  private _title: ActionTitle;
  private _step: StepValue;
  private _position: number;

  constructor(data: IActionCreate) {
    this.id = new ActionId(data.id);
    this._title = new ActionTitle(data.title);
    this._step = new StepValue(data.step);
    this._position = data.position;
  }

  get title(): string {
    return this._title.value;
  }

  get step(): string {
    return this._step.value;
  }

  get position(): number {
    return this._position;
  }

  rename(newTitle: ActionTitle): void {
    this._title = newTitle;
  }

  changeStep(newStep: StepValue): void {
    this._step = newStep;
  }

  moveTo(newPosition: number): void {
    if (newPosition < 0) {
      throw new Error('Posição não pode ser negativa');
    }
    this._position = newPosition;
  }

  isAtPosition(position: number): boolean {
    return this._position === position;
  }
}
