import { Profile } from "@modules/profile/core/entities/profile"
import { IProfileRepository } from "@modules/profile/core/ports/profile.repository"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { MySetting, ProfileModel, SettingModel } from "./model"
import { ProfileMapper } from "./mapper"

export class ProfileMongoRepository implements IProfileRepository {
  constructor(
    @InjectModel(ProfileModel.name, "profiles")
    private readonly collection: Model<ProfileModel>,
  ) {}

  async findById(id: string, { fetchSettings }: { fetchSettings: boolean }) {
    const profileModel = await this.collection.findById(id).exec()
    if (!profileModel) {
      return null
    }

    if (!fetchSettings) {
      return ProfileMapper.toDomain(profileModel)
    }

    const settingModels = await this.collection
      .aggregate<{ my_settings: MySetting[]; settings: SettingModel[] }>([
        { $match: { _id: id } },
        {
          $lookup: {
            from: "settings",
            localField: "my_settings._id",
            foreignField: "_id",
            as: "settings",
          },
        },
        {
          $project: {
            _id: 0,
            my_settings: {
              $sortArray: { input: "$my_settings", sortBy: { _id: 1 } },
            },
            settings: {
              $sortArray: { input: "$settings", sortBy: { _id: 1 } },
            },
          },
        },
      ])
      .exec()
      .then((result) => result[0])

    profileModel.my_settings = settingModels.my_settings
    profileModel.settings = settingModels.settings

    return ProfileMapper.toDomain(profileModel)
  }

  async save(profile: Profile) {
    const model = ProfileMapper.fromDomain(profile)
    await this.collection.updateOne({ _id: model._id }, model).exec()
  }
}
