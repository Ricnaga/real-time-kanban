import type Redis from 'ioredis';
import type { IPubSub, PubSubChannel } from '@/backend/shared/interfaces';

export class RedisPubSub implements IPubSub {
  private readonly subscribers = new Map<
    PubSubChannel,
    Set<(data: string) => void>
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
          const parsed = JSON.parse(data) as unknown;
          if (resolve) {
            resolve({ value: parsed, done: false });
            resolve = undefined;
          } else {
            queue.push(parsed);
          }
        };

        listeners.add(onData);

        if (this.subscribers.size === 0) {
          this.subscriber.subscribe(channel);
        }

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
            }

            return Promise.resolve({ value: undefined, done: true });
          },
          throw: (error: unknown) => {
            listeners.delete(onData);

            if (listeners.size === 0) {
              this.subscribers.delete(channel);
              this.subscriber.unsubscribe(channel);
            }

            return Promise.reject(error);
          },
        };
      },
    };
  }

  private getOrCreateListeners(
    channel: PubSubChannel,
  ): Set<(data: string) => void> {
    let listeners = this.subscribers.get(channel);

    if (!listeners) {
      listeners = new Set();
      this.subscribers.set(channel, listeners);

      this.subscriber.on('message', (ch: string, data: string) => {
        if (ch === channel) {
          listeners?.forEach((cb) => cb(data));
        }
      });
    }

    return listeners;
  }
}
