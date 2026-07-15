export type PubSubEvent =
  | { channel: 'ACTION_CREATED'; payload: unknown }
  | { channel: 'ACTION_UPDATED'; payload: unknown }
  | { channel: 'ACTION_DELETED'; payload: unknown }
  | { channel: 'ACTION_MOVED'; payload: unknown }
  | { channel: 'TASK_CREATED'; payload: unknown }
  | { channel: 'TASK_UPDATED'; payload: unknown }
  | { channel: 'TASK_DELETED'; payload: unknown }
  | { channel: 'TASK_MOVED'; payload: unknown };

export type PubSubChannel = PubSubEvent['channel'];

export interface IPubSub {
  publish<T>(channel: PubSubChannel, payload: T): Promise<void>;
  subscribe(channel: PubSubChannel): AsyncIterable<unknown>;
}
