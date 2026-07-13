import { actionAdapter } from '@/bff/adapters';
import { ActionConnector } from '@/bff/connectors';

export function createActionAdapter() {
  const connector = new ActionConnector();
  return actionAdapter(connector);
}
