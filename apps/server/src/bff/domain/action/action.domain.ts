import type { ActionModel } from '../../connectors/action/action.model';
import { BaseDomain } from '../base.domain';

export class ActionDomain extends BaseDomain {
  static readonly __typename: string = ActionDomain.name;

  readonly id: string;
  readonly title: string;
  readonly step: string;
  readonly position: number;

  constructor(model: ActionModel) {
    super();

    this.id = ActionDomain.uuidToRelay(model.id);
    this.title = model.title;
    this.step = model.step;
    this.position = model.position;
  }

  static fromModel(model: ActionModel): ActionDomain {
    return new ActionDomain(model);
  }
}
