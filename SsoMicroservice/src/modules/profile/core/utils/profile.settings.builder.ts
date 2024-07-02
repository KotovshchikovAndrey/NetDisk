import { ISetting } from "../entities/setting"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "./profile.settings.factory"

export class ProfileSettingsBuilder {
  private readonly settings: ISetting[] = []

  build() {
    return this.settings
  }

  add(setting: ISetting) {
    this.settings.push(setting)
    return this
  }
}

const builder = new ProfileSettingsBuilder()
export const defaultSettings = builder
  .add(new TwoFactorSettingFactory().create())
  .add(new BackgroundColorSettingFactory().create())
  .build()
