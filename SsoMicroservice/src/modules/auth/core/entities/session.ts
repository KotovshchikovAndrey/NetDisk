import { addTimeToDate, getUtcNowDate } from "@libs/datetime"
import { Entity } from "@libs/ddd/entity"

type SessionData = {
  userId: string
  createdAt: Date
  expiredAt: Date
}

export class Session extends Entity<SessionData> {
  constructor({ id, ...data }: SessionData & { id?: string }) {
    super(data, id)
  }

  static createForUser(userId: string) {
    return new Session({
      userId,
      createdAt: getUtcNowDate(),
      expiredAt: addTimeToDate(getUtcNowDate(), 60 * 60 * 24 * 7), // 1 week,
    })
  }

  isExpired() {
    return this.data.expiredAt <= getUtcNowDate()
  }

  getTtl() {
    return this.expiredAt.getTime() - this.createdAt.getTime()
  }

  get userId() {
    return this.data.userId
  }

  get createdAt() {
    return this.data.createdAt
  }

  get expiredAt() {
    return this.data.expiredAt
  }
}
