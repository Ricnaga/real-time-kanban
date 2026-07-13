import { createActionAdapter } from '@/bff/factories';

export type { IActionPort } from './action';
export { actionAdapter } from './action';

export const adapters = {
  action: createActionAdapter(),
};
