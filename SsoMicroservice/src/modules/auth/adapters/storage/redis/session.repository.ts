import { getCurrentTimestamp } from "@libs/datetime"
import { REDIS_CLIENT_PROVIDER } from "@modules/auth/core/configs/settings"
import { Session } from "@modules/auth/core/entities/session"
import { ISessionRepository } from "@modules/auth/core/ports/session.repository"
import { Inject } from "@nestjs/common"
import Redis from "ioredis"

export class SessionRedisRepository implements ISessionRepository {
  constructor(
    @Inject(REDIS_CLIENT_PROVIDER)
    private readonly redis: Redis,
  ) {}

  async findById(id: string) {
    const data = await this.redis.get(id)
    if (!data) return null

    return new Session(JSON.parse(data))
  }

  async save(session: Session) {
    const data = JSON.stringify({
      id: session.id,
      userId: session.userId,
      createdAt: session.createdAt,
      expiredAt: session.expiredAt,
    })

    this.redis.setex(session.id, session.getTtl(), data)
  }

  async deleteById(id: string) {
    this.redis.del(id)
  }
}
