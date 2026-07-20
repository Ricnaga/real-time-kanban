import container from '@/backend/shared/container';
import { TYPES } from '@/backend/shared/container/di/types';
import type { IPubSub, PubSubChannel } from '@kanban/shared';

export class PubSubConnector implements IPubSub {
  private readonly pubSub: IPubSub;

  constructor() {
    this.pubSub = container.get<IPubSub>(TYPES.PubSub);
  }

  publish<T>(channel: PubSubChannel, payload: T) {
    return this.pubSub.publish(channel, payload);
  }

  subscribe(channel: PubSubChannel) {
    return this.pubSub.subscribe(channel);
  }
}
