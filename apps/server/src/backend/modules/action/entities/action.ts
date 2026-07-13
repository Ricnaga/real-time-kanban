import { ActionId } from '../value-objects/action-id';

export interface IAction {
  id: ActionId;
  title: string;
  step: string;
}

export type IActionCreate = Omit<IAction, 'id'> & { id?: string };

export class Action implements IAction {
  public readonly id: ActionId;
  public title: string;
  public step: string;

  constructor(data: IActionCreate) {
    this.id = new ActionId(data.id);
    this.title = data.title;
    this.step = data.step;
  }
}
