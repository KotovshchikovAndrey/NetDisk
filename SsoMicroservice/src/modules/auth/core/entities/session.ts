import { addTimeToDate, getUtcNowDate } from "@libs/datetime"
import { Entity } from "@libs/ddd"

type ISessionData = {
  userId: string
  expiredAt: Date
}

export class Session extends Entity<ISessionData> {
  constructor({ id, ...data }: ISessionData & { id?: string }) {
    super(data, id)
  }

  static createForUser(userId: string) {
    return new Session({
      userId,
      expiredAt: addTimeToDate(getUtcNowDate(), 60 * 60 * 24 * 7), // 1 week,
    })
  }

  isExpired() {
    const utcNow = new Date(Math.floor(Date.now()))
    return this.data.expiredAt <= utcNow
  }

  get userId() {
    return this.data.userId
  }

  get expiredAt() {
    return this.data.expiredAt
  }
}
