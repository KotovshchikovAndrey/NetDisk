import { Entity } from "@libs/ddd/entity"
import { JwtPayload } from "@libs/jwt"

type TokenData = {
  createdAt: Date
  expiredAt: Date
  userId: string
  deviceId: string
  isRevoked: boolean
}

export class Token extends Entity<TokenData> {
  constructor({ id, ...data }: TokenData & { id?: string }) {
    super(data, id)
  }

  static create(payload: JwtPayload, deviceId: string) {
    return new Token({
      id: payload.jti,
      userId: payload.sub,
      isRevoked: false,
      deviceId,
      createdAt: new Date(payload.iat * 1000),
      expiredAt: new Date(payload.exp * 1000),
    })
  }

  get createdAt() {
    return this.data.createdAt
  }

  get expiredAt() {
    return this.data.expiredAt
  }

  get userId() {
    return this.data.userId
  }

  get deviceId() {
    return this.data.deviceId
  }

  get isRevoked() {
    return this.data.isRevoked
  }
}
