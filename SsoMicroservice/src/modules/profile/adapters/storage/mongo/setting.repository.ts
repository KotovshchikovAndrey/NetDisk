import { Setting } from "@modules/profile/core/entities/setting"
import { ISettingRepository } from "@modules/profile/core/ports/setting.repository"
import { InjectConnection } from "@nestjs/mongoose"
import { SettingModel } from "./model"
import { Connection, Collection } from "mongoose"
import { SettingMapper } from "./mapper"

export class SettingMongoRepository implements ISettingRepository {
  private readonly collection: Collection<SettingModel>

  constructor(
    @InjectConnection("settings")
    connection: Connection,
  ) {
    this.collection = <Collection<SettingModel>>(
      connection.db.collection<SettingModel>("settings")
    )
  }

  async findById(id: string) {
    const model = await this.collection.findOne({ _id: id })
    if (!model) {
      return null
    }

    return SettingMapper.toDomain(model)
  }

  async save(...settings: Setting[]) {
    const models = settings.map((setting) => SettingMapper.fromDomain(setting))
    await this.collection.insertMany(models)
  }

  async isEmpty() {
    const documentCount = await this.collection.countDocuments()
    return documentCount === 0
  }
}
