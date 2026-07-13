import { ActionId } from '../value-objects/action-id';

export enum Step {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DEPLOY = 'DEPLOY',
  DONE = 'DONE',
}

export interface IAction {
  id: ActionId;
  title: string;
  step: Step;
}

export type IActionCreate = Omit<IAction, 'id'> & { id?: string };

export class Action implements IAction {
  public readonly id: ActionId;
  public title: string;
  public step: Step;

  constructor(data: IActionCreate) {
    this.id = new ActionId(data.id);
    this.title = data.title;
    this.step = data.step;
  }
}
