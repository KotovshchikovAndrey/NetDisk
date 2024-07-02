import { Entity } from "@libs/ddd"
import { IJwtPayload } from "@libs/jwt"

type ITokenData = {
  createdAt: Date
  expiredAt: Date
  userId: string
  deviceId: string
  isRevoked: boolean
}

export class Token extends Entity<ITokenData> {
  constructor({ id, ...data }: ITokenData & { id?: string }) {
    super(data, id)
  }

  static create(payload: IJwtPayload, deviceId: string) {
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
