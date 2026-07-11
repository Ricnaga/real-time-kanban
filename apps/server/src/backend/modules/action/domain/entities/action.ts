import { v4 as uuid } from 'uuid'
import { ActionId } from '../value-objects/action-id'

export enum Step {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DEPLOY = 'DEPLOY',
  DONE = 'DONE',
}

export interface IAction {
  id: ActionId
  title: string
  step: Step
}

export type IActionCreate = Omit<IAction, 'id'> & { id?: ActionId }

export class Action implements IAction {
  public readonly id: ActionId
  public title: string
  public step: Step

  constructor(data: IActionCreate) {
    this.id = data.id ?? new ActionId(uuid())
    this.title = data.title
    this.step = data.step
  }
}
