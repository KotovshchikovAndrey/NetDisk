import {
  ISetting,
  MultipleSetting,
  SingleSetting,
  ToggleSetting,
} from "@modules/profile/core/entities/setting"
import { ISettingRepository } from "@modules/profile/core/ports/setting.repository"
import { InjectConnection } from "@nestjs/mongoose"
import {
  MultipleSettingModel,
  MultipleSettingSchema,
  SettingDocumet,
  SingleSettingModel,
  SingleSettingSchema,
  ToggleSettingModel,
  ToggleSettingSchema,
} from "./model"
import { Connection, Collection } from "mongoose"
import {
  MultipleSettingMapper,
  SingleSettingMapper,
  ToggleSettingMapper,
} from "./mapper"

export class SettingMongoRepository implements ISettingRepository {
  private readonly collection: Collection<SettingDocumet>

  constructor(
    @InjectConnection("settings")
    connection: Connection,
  ) {
    this.collection = <Collection<SettingDocumet>>(
      connection.db.collection<SettingDocumet>("settings")
    )
  }

  async findById(id: string) {
    const model = await this.collection.findOne({ _id: id })
    if (!model) {
      return null
    }

    switch (model.schema) {
      case ToggleSettingSchema:
        return ToggleSettingMapper.toDomain(model as ToggleSettingModel)

      case SingleSettingSchema:
        return SingleSettingMapper.toDomain(model as SingleSettingModel)

      case MultipleSettingSchema:
        return MultipleSettingMapper.toDomain(model as MultipleSettingModel)
    }
  }

  async save(...settings: ISetting[]) {
    const models = settings.map((setting) => {
      if (setting instanceof ToggleSetting) {
        return ToggleSettingMapper.fromDomain(setting)
      }

      if (setting instanceof SingleSetting) {
        return SingleSettingMapper.fromDomain(setting)
      }

      if (setting instanceof MultipleSetting) {
        return MultipleSettingMapper.fromDomain(setting)
      }
    })

    await this.collection.insertMany(<SettingDocumet[]>models)
  }

  async isEmpty() {
    const documentCount = await this.collection.countDocuments()
    return documentCount === 0
  }
}
