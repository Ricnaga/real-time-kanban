import { taskAdapter } from '@/bff/adapters';
import { TaskConnector } from '@/bff/connectors';

export function createTaskAdapter() {
  const connector = new TaskConnector();
  return taskAdapter(connector);
}
