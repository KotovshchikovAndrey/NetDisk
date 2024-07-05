import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
  MultipleSettingModel,
  MultipleSettingSchema,
  ProfileModel,
  ProfileSchema,
  SingleSettingModel,
  SingleSettingSchema,
  ToggleSettingModel,
  ToggleSettingSchema,
} from "./adapters/storage/mongo/models"
import {
  PROFILE_REPOSITORY_PROVIDER,
  SETTING_REPOSITORY_PROVIDER,
} from "./core/config/settings"
import { SettingMongoRepository } from "./adapters/storage/mongo/setting.repository"
import { SettingSerive } from "./core/services/settings.service"
import { SettingController } from "./adapters/transport/rest/setting.controller"
import { ProfileService } from "./core/services/profile.service"
import { CreateProfileHandler } from "./core/events/handlers/create-profile.handler"
import { ProfileMongoRepository } from "./adapters/storage/mongo/profile.repository"
import { ProfileController } from "./adapters/transport/rest/profile.controller"

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: ToggleSettingModel.name, schema: ToggleSettingSchema },
        { name: SingleSettingModel.name, schema: SingleSettingSchema },
        { name: MultipleSettingModel.name, schema: MultipleSettingSchema },
      ],
      "settings",
    ),

    MongooseModule.forFeature(
      [{ name: ProfileModel.name, schema: ProfileSchema }],
      "profiles",
    ),
  ],
  providers: [
    { provide: SETTING_REPOSITORY_PROVIDER, useClass: SettingMongoRepository },
    {
      provide: PROFILE_REPOSITORY_PROVIDER,
      useClass: ProfileMongoRepository,
    },

    ProfileService,
    SettingSerive,

    CreateProfileHandler,
  ],
  controllers: [ProfileController, SettingController],
})
export class ProfileModule {}
