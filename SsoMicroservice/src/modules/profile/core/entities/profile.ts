import { ISetting, ToggleSetting } from "./setting"
import { ProfileSettingsBuilder } from "../utils/profile.settings.builder"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "../utils/profile.settings.factory"
import { ProfileSettings } from "../config/enums"
import { Entity } from "@libs/ddd/entity"

type IProfileData = {
  name: string
  email: string
  is2faEnabled: boolean
  isVerified: boolean
  settings: ISetting[]
}

export class Profile extends Entity<IProfileData> {
  constructor({ id, ...data }: IProfileData & { id?: string }) {
    super(data, id)
  }

  static create() {}

  setDefaultSettings() {
    const settingsBuilder = new ProfileSettingsBuilder()
    this.data.settings = settingsBuilder
      .add(new TwoFactorSettingFactory().create())
      .add(new BackgroundColorSettingFactory().create())
      .build()
  }

  toggle2faAuthentication() {
    this.data.settings.forEach((setting) => {
      if (setting.id === ProfileSettings.TWO_FACTOR_AUTHENTICATION) {
        const twofaSetting = setting as ToggleSetting
        twofaSetting.toggle()
        return
      }
    })
  }
}
