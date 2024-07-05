import { Injectable, Inject } from "@nestjs/common"
import { SETTING_REPOSITORY_PROVIDER } from "../config/settings"
import { ISettingRepository } from "../ports/setting.repository"
import { ProfileSettingsBuilder } from "../utils/profile.settings.builder"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "../utils/profile.settings.factory"
import { ConflictError } from "@modules/common/errors"

@Injectable()
export class SettingSerive {
  constructor(
    @Inject(SETTING_REPOSITORY_PROVIDER)
    private readonly repository: ISettingRepository,
  ) {}

  async createDefaultSettings() {
    const isEmptyRepository = await this.repository.isEmpty()
    if (!isEmptyRepository) {
      throw new ConflictError("Default settings already created")
    }

    const settingBuilder = new ProfileSettingsBuilder()
    const settings = settingBuilder
      .add(new TwoFactorSettingFactory().create())
      .add(new BackgroundColorSettingFactory().create())
      .build()

    this.repository.save(...settings)
  }
}
