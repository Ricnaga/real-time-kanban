import Redis from 'ioredis'
import type { EventPublisher } from '../../ports/event-publisher.port'

export class RedisEventPublisher implements EventPublisher {
  constructor(private readonly redis: Redis) {}

  async publish(topic: string, payload: unknown): Promise<void> {
    await this.redis.publish(topic, JSON.stringify(payload))
  }
}
