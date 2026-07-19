import type { TaskModel } from '../../connectors/task/task.model';
import { BaseDomain } from '../base.domain';
import { ActionDomain } from '../action/action.domain';

export class TaskDomain extends BaseDomain {
  static readonly __typename: string = TaskDomain.name;

  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly position: number;
  readonly actionId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(model: TaskModel) {
    super();

    this.id = TaskDomain.uuidToRelay(model.id);
    this.title = model.title;
    this.description = model.description;
    this.position = model.position;
    this.actionId = ActionDomain.uuidToRelay(model.actionId);
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }

  static fromModel(model: TaskModel): TaskDomain {
    return new TaskDomain(model);
  }
}
