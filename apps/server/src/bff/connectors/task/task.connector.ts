import { TaskController } from '@/backend/modules/task/controllers/task.controller';
import container from '@/backend/shared/container';
import { TaskModel } from './task.model';

export class TaskConnector {
  private readonly controller: TaskController;

  constructor() {
    this.controller = container.get(TaskController);
  }

  async findById(id: string): Promise<TaskModel> {
    const task = await this.controller.findById(id);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      position: task.position,
      actionId: task.actionId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async findByActionId(actionId: string): Promise<TaskModel[]> {
    const tasks = await this.controller.findByActionId(actionId);
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      position: t.position,
      actionId: t.actionId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async create(data: {
    title: string;
    description?: string | null;
    actionId: string;
  }): Promise<TaskModel> {
    const task = await this.controller.create({
      title: data.title,
      description: data.description,
      actionId: data.actionId,
    });
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      position: task.position,
      actionId: task.actionId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async update(data: {
    id: string;
    title?: string;
    description?: string | null;
    position?: number;
    actionId?: string;
  }): Promise<TaskModel> {
    const task = await this.controller.update({
      id: data.id,
      title: data.title,
      description: data.description,
      position: data.position,
      actionId: data.actionId,
    });
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      position: task.position,
      actionId: task.actionId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.controller.delete(id);
  }

  async move(
    taskId: string,
    newPosition: number,
    newActionId?: string,
  ): Promise<TaskModel[]> {
    const tasks = await this.controller.move({
      taskId,
      newPosition,
      newActionId,
    });
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      position: t.position,
      actionId: t.actionId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }
}
