import { ActionConnector } from '@/bff/connectors';
import { ActionDomain } from '@/bff/domain/action/action.domain';
import { IActionPort } from './action-port';

export function actionAdapter(connector: ActionConnector): IActionPort {
  return {
    findAll: async () => {
      const actions = await connector.findAll();
      return actions.map((action) => ActionDomain.fromModel(action));
    },
    findById: async (id) => {
      const action = await connector.findById(id);
      return ActionDomain.fromModel(action);
    },
    create: async (data) => {
      const action = await connector.create(data);
      return ActionDomain.fromModel(action);
    },
    update: async (data) => {
      const action = await connector.update(data);
      return ActionDomain.fromModel(action);
    },

    delete: (id) => connector.delete(id),
  };
}
