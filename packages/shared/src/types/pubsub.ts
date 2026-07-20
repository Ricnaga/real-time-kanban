export type PubSubChannel =
  | 'ACTION_CREATED'
  | 'ACTION_UPDATED'
  | 'ACTION_DELETED'
  | 'ACTION_MOVED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'TASK_MOVED';

export interface IPubSub {
  publish<T>(channel: PubSubChannel, payload: T): Promise<void>;
  subscribe(channel: PubSubChannel): AsyncIterable<unknown>;
}
