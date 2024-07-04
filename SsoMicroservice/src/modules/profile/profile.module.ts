import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
  MultipleSettingModel,
  MultipleSettingSchema,
  SingleSettingModel,
  SingleSettingSchema,
  ToggleSettingModel,
  ToggleSettingSchema,
} from "./adapters/storage/mongo/model"
import {
  PROFILE_REPOSITORY_PROVIDER,
  SETTING_REPOSITORY_PROVIDER,
} from "./core/config/settings"
import { SettingMongoRepository } from "./adapters/storage/mongo/setting.repository"
import { SettingSerive } from "./core/services/settings.service"
import { SettingController } from "./adapters/transport/rest/setting.controller"
import { ProfileService } from "./core/services/profile.service"
import { CreateProfileHandler } from "./core/events/handlers/create.profile"
import { ProfileMongoRepository } from "./adapters/storage/mongo/profile.repository"

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
  ],
  providers: [
    { provide: SETTING_REPOSITORY_PROVIDER, useClass: SettingMongoRepository },
    {
      provide: PROFILE_REPOSITORY_PROVIDER,
      useClass: ProfileMongoRepository,
    },

    SettingSerive,
    ProfileService,

    CreateProfileHandler,
  ],
  controllers: [SettingController],
  exports: [CreateProfileHandler],
})
export class ProfileModule {}
