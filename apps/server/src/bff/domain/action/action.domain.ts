import type { ActionModel } from './action.model'

export class ActionDomain {
  public readonly id: string
  public readonly title: string
  public readonly step: string

  constructor(model: ActionModel) {
    this.id = model.id
    this.title = model.title
    this.step = model.step
  }
}
