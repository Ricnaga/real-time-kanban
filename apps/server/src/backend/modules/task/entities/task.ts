import { TaskId } from '../value-objects/task-id';
import { TaskTitle } from '../value-objects/task-title';
import { TaskDescription } from '../value-objects/task-description';

export interface ITaskCreate {
  id?: string;
  title: string;
  description?: string | null;
  position: number;
  actionId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  public readonly id: string;
  public title: string;
  public description: string | null;
  public position: number;
  public actionId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: ITaskCreate) {
    this.id = new TaskId(data.id).value;
    this.title = new TaskTitle(data.title).value;
    this.description = new TaskDescription(data.description).value;
    this.position = data.position;
    this.actionId = data.actionId;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
