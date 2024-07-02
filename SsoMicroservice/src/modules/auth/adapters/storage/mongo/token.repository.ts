import { Token } from "@modules/auth/core/entities/token"
import { ITokenRepository } from "@modules/auth/core/ports/token.repository"
import { InjectModel } from "@nestjs/mongoose"
import { TokenDocument, TokenModel } from "./models"
import { Model } from "mongoose"
import { TokenMapper } from "./mappers"
import { getUtcNowDate } from "@libs/datetime"

export class TokenMongoRepository implements ITokenRepository {
  constructor(
    @InjectModel(TokenModel.name, "tokens")
    private readonly tokenCollection: Model<TokenDocument>,
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
    this.tokenCollection.updateOne({ _id: id }, { isRevoked: true })
  }

  async revokeByUserDevice(userId: string, deviceId: string) {
    this.tokenCollection
      .updateOne({ userId, deviceId }, { isRevoked: true })
      .exec()
  }

  async revokeByUser(userId: string) {
    this.tokenCollection.updateOne({ userId }, { isRevoked: true }).exec()
  }

  async removeExpired() {
    this.tokenCollection
      .deleteMany({ expiredAt: { $lte: getUtcNowDate() } })
      .exec()
  }
}
