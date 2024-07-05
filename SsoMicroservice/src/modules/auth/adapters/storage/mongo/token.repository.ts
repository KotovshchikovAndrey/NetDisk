import { Token } from "@modules/auth/core/entities/token"
import { ITokenRepository } from "@modules/auth/core/ports/token.repository"
import { InjectModel } from "@nestjs/mongoose"
import { TokenModel } from "./model"
import { Model } from "mongoose"
import { TokenMapper } from "./mapper"
import { getUtcNowDate } from "@libs/datetime"

export class TokenMongoRepository implements ITokenRepository {
  constructor(
    @InjectModel(TokenModel.name, "tokens")
    private readonly tokenCollection: Model<TokenModel>,
  ) {}

  async findById(id: string) {
    const model = await this.tokenCollection.findById(id).exec()
    if (!model) {
      return null
    }

    return TokenMapper.toDomain(model)
  }

  async save(token: Token) {
    const model = TokenMapper.fromDomain(token)
    this.tokenCollection
      .updateOne({ _id: model._id }, model, { upsert: true })
      .exec()
  }

  async revokeById(id: string) {
    this.tokenCollection.updateOne({ _id: id }, { $set: { is_revoked: true } })
  }

  async revokeByUserDevice(userId: string, deviceId: string) {
    this.tokenCollection
      .updateMany(
        { user_id: userId, device_id: deviceId },
        { $set: { is_revoked: true } },
      )
      .exec()
  }

  async revokeByUser(userId: string) {
    this.tokenCollection
      .updateMany({ user_id: userId }, { $set: { is_revoked: true } })
      .exec()
  }

  async removeExpired() {
    await this.tokenCollection
      .deleteMany({ expired_at: { $lte: getUtcNowDate() } })
      .exec()
  }
}
