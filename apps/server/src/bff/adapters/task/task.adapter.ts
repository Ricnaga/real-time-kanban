import { TaskConnector } from '@/bff/connectors';
import { TaskDomain } from '@/bff/domain/task/task.domain';
import { ITaskPort } from './task-port';

export function taskAdapter(connector: TaskConnector): ITaskPort {
  return {
    findById: async (id) => {
      const task = await connector.findById(id);
      return TaskDomain.fromModel(task);
    },
    findByActionId: async (actionId) => {
      const tasks = await connector.findByActionId(actionId);
      return tasks.map((task) => TaskDomain.fromModel(task));
    },
    create: async (data) => {
      const task = await connector.create(data);
      return TaskDomain.fromModel(task);
    },
    update: async (data) => {
      const task = await connector.update(data);
      return TaskDomain.fromModel(task);
    },
    delete: (id) => connector.delete(id),
    move: async (taskId, newPosition, newActionId) => {
      const tasks = await connector.move(taskId, newPosition, newActionId);
      return tasks.map((task) => TaskDomain.fromModel(task));
    },
  };
}
