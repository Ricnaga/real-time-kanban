import type { IPubSub, PubSubChannel } from '@/backend/shared/interfaces';

export class MemoryPubSub implements IPubSub {
  private readonly listeners = new Map<
    PubSubChannel,
    Set<(data: unknown) => void>
  >();

  async publish<T>(channel: PubSubChannel, payload: T): Promise<void> {
    const channelListeners = this.listeners.get(channel);
    if (!channelListeners) return;

    channelListeners.forEach((cb) => cb(payload));
  }

  subscribe(channel: PubSubChannel): AsyncIterable<unknown> {
    return {
      [Symbol.asyncIterator]: () => {
        const listeners = this.getOrCreateListeners(channel);

        let resolve: ((value: IteratorResult<unknown>) => void) | undefined;
        const queue: unknown[] = [];
        let done = false;

        const onData = (data: unknown) => {
          if (resolve) {
            resolve({ value: data, done: false });
            resolve = undefined;
          } else {
            queue.push(data);
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
              this.listeners.delete(channel);
            }

            return Promise.resolve({ value: undefined, done: true });
          },
          throw: (error: unknown) => {
            listeners.delete(onData);

            if (listeners.size === 0) {
              this.listeners.delete(channel);
            }

            return Promise.reject(error);
          },
        };
      },
    };
  }

  private getOrCreateListeners(
    channel: PubSubChannel,
  ): Set<(data: unknown) => void> {
    let listeners = this.listeners.get(channel);

    if (!listeners) {
      listeners = new Set();
      this.listeners.set(channel, listeners);
    }

    return listeners;
  }
}
