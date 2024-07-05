import { Setting } from "../entities/setting"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "./profile.settings.factory"

export class ProfileSettingsBuilder {
  private readonly settings: Setting[] = []

  build() {
    return this.settings
  }

  add(setting: Setting) {
    this.settings.push(setting)
    return this
  }
}

const builder = new ProfileSettingsBuilder()
export const defaultSettings = builder
  .add(new TwoFactorSettingFactory().create())
  .add(new BackgroundColorSettingFactory().create())
  .build()
