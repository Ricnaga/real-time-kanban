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
  public readonly id: string;
  public title: string;
  public step: string;
  public position: number;

  constructor(data: IActionCreate) {
    this.id = new ActionId(data.id).value;
    this.title = new ActionTitle(data.title).value;
    this.step = new StepValue(data.step).value;
    this.position = data.position;
  }
}
