import { Inject, Injectable } from "@nestjs/common"
import { ISessionRepository } from "../ports/session.repository"
import { SESSION_REPOSITORY_PROVIDER } from "../configs/settings"
import { SessionOutput } from "../dto/output"
import { Session } from "../entities/session"

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_PROVIDER)
    private readonly repository: ISessionRepository,
  ) {}

  async get(id: string) {
    const session = await this.repository.findById(id)
    if (!session || session.isExpired()) {
      throw new Error("Session expired")
    }

    return new SessionOutput(
      session.id,
      session.userId,
      session.createdAt,
      session.expiredAt,
    )
  }

  async createForUser(userId: string) {
    const newSession = Session.createForUser(userId)
    await this.repository.save(newSession)

    return new SessionOutput(
      newSession.id,
      newSession.userId,
      newSession.createdAt,
      newSession.expiredAt,
    )
  }

  async invalidate(id: string) {
    this.repository.deleteById(id).catch((err) => {
      // send to broker for retry
    })
  }
}
