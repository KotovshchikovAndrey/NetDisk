import { User } from "@modules/auth/core/entities/user"
import { IUserRepository } from "@modules/auth/core/ports/user.repository"
import { Model } from "mongoose"
import { UserDocument, UserModel } from "./model"
import { InjectModel } from "@nestjs/mongoose"
import { UserMapper } from "./mapper"

export class UserMongoRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel.name, "users")
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    const model = await this.userCollection.findById(id).exec()
    if (!model) {
      return null
    }

    return UserMapper.toDomain(model)
  }

  async findByEmail(email: string) {
    const model = await this.userCollection.findOne({ email }).exec()
    if (!model) {
      return null
    }

    return UserMapper.toDomain(model)
  }

  async save(user: User) {
    const model = UserMapper.fromDomain(user)
    this.userCollection
      .updateOne({ _id: model._id }, model, { upsert: true })
      .exec()
  }
}
