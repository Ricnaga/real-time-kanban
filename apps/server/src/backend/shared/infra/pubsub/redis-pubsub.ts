import type Redis from 'ioredis';
import type { IPubSub, PubSubChannel } from '@/backend/shared/interfaces';

export class RedisPubSub implements IPubSub {
  private readonly subscribers = new Map<
    PubSubChannel,
    Set<(data: string) => void>
  >();

  private readonly messageHandlers = new Map<
    PubSubChannel,
    (ch: string, data: string) => void
  >();

  constructor(
    private readonly publisher: Redis,
    private readonly subscriber: Redis,
  ) {}

  async publish<T>(channel: PubSubChannel, payload: T): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(payload));
  }

  subscribe(channel: PubSubChannel): AsyncIterable<unknown> {
    return {
      [Symbol.asyncIterator]: () => {
        const listeners = this.getOrCreateListeners(channel);

        let resolve: ((value: IteratorResult<unknown>) => void) | undefined;
        const queue: unknown[] = [];
        let done = false;

        const onData = (data: string) => {
          const parsed = JSON.parse(data, (_key, value) => {
            if (
              typeof value === 'string' &&
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
            ) {
              return new Date(value);
            }
            return value;
          }) as unknown;
          if (resolve) {
            resolve({ value: parsed, done: false });
            resolve = undefined;
          } else {
            queue.push(parsed);
          }
        };

        listeners.add(onData);

        return {
          next: () => {
            if (queue.length > 0) {
              return Promise.resolve({ value: queue.shift()!, done: false });
            }
            if (done) {
              return Promise.resolve({ value: undefined, done: true });
            }
            return new Promise<IteratorResult<unknown>>((r) => {
              resolve = r;
            });
          },
          return: () => {
            listeners.delete(onData);

            if (listeners.size === 0) {
              this.subscribers.delete(channel);
              this.subscriber.unsubscribe(channel);
              this.removeMessageHandler(channel);
            }

            return Promise.resolve({ value: undefined, done: true });
          },
          throw: (error: unknown) => {
            listeners.delete(onData);

            if (listeners.size === 0) {
              this.subscribers.delete(channel);
              this.subscriber.unsubscribe(channel);
              this.removeMessageHandler(channel);
            }

            return Promise.reject(error);
          },
        };
      },
    };
  }

  private removeMessageHandler(channel: PubSubChannel): void {
    const handler = this.messageHandlers.get(channel);
    if (handler) {
      this.subscriber.removeListener('message', handler);
      this.messageHandlers.delete(channel);
    }
  }

  private getOrCreateListeners(
    channel: PubSubChannel,
  ): Set<(data: string) => void> {
    let listeners = this.subscribers.get(channel);

    if (!listeners) {
      listeners = new Set();
      this.subscribers.set(channel, listeners);

      const handler = (ch: string, data: string) => {
        if (ch === channel) {
          listeners?.forEach((cb) => cb(data));
        }
      };
      this.messageHandlers.set(channel, handler);
      this.subscriber.on('message', handler);
      this.subscriber.subscribe(channel);
    }

    return listeners;
  }
}
