import { TaskConnector } from '@/bff/connectors';
import { TaskDomain } from '@/bff/domain/task/task.domain';
import { ActionDomain } from '@/bff/domain/action/action.domain';
import { ITaskPort } from './task-port';

export function taskAdapter(connector: TaskConnector): ITaskPort {
  return {
    findById: async (id) => {
      const uuid = TaskDomain.relayToUuid(id);
      const task = await connector.findById(uuid);
      return TaskDomain.fromModel(task);
    },
    findByActionId: async (actionId) => {
      const uuid = ActionDomain.relayToUuid(actionId);
      const tasks = await connector.findByActionId(uuid);
      return tasks.map((task) => TaskDomain.fromModel(task));
    },
    create: async (data) => {
      const actionUuid = ActionDomain.relayToUuid(data.actionId);
      const task = await connector.create({
        title: data.title,
        description: data.description,
        actionId: actionUuid,
      });
      return TaskDomain.fromModel(task);
    },
    update: async (data) => {
      const uuid = TaskDomain.relayToUuid(data.id);
      const task = await connector.update({
        id: uuid,
        title: data.title,
        description: data.description,
        position: data.position,
        actionId: data.actionId,
      });
      return TaskDomain.fromModel(task);
    },
    delete: async (id) => {
      const uuid = TaskDomain.relayToUuid(id);
      connector.delete(uuid);
    },
    move: async (taskId, newPosition, newActionId) => {
      const taskUuid = TaskDomain.relayToUuid(taskId);
      const actionUuid = newActionId
        ? ActionDomain.relayToUuid(newActionId)
        : undefined;
      const tasks = await connector.move(taskUuid, newPosition, actionUuid);
      return tasks.map((task) => TaskDomain.fromModel(task));
    },
  };
}
