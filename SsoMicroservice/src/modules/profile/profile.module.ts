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
import { SETTING_REPOSITORY_PROVIDER } from "./core/config/settings"
import { SettingMongoRepository } from "./adapters/storage/mongo/setting.repository"
import { SettingSerive } from "./core/services/settings.service"
import { SettingController } from "./adapters/transport/rest/setting.controller"

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
    SettingSerive,
  ],
  controllers: [SettingController],
})
export class ProfileModule {}
