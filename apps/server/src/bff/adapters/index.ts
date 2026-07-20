import { createActionAdapter } from '@/bff/factories';
import { createTaskAdapter } from '@/bff/factories';
import { createStatisticsAdapter } from '@/bff/factories';

export type { IActionPort } from './action';
export { actionAdapter } from './action';

export type { ITaskPort } from './task';
export { taskAdapter } from './task';

export type { IStatisticsPort } from './statistics';
export { statisticsAdapter } from './statistics';

export const adapters = {
  action: createActionAdapter(),
  task: createTaskAdapter(),
  statistics: createStatisticsAdapter(),
};
