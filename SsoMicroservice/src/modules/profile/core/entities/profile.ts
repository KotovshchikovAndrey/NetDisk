import { ISetting } from "./setting"
import { ProfileSettingsBuilder } from "../utils/profile.settings.builder"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "../utils/profile.settings.factory"
import { Entity } from "@libs/ddd/entity"
import { Email } from "@modules/common/value"

type IProfileData = {
  name: string
  email: Email
  is2faEnabled: boolean
  isVerified: boolean
  settings: ISetting[]
}

export class Profile extends Entity<IProfileData> {
  constructor({ id, ...data }: IProfileData & { id: string }) {
    super(data, id)
  }

  static createForUser(data: Omit<IProfileData, "settings"> & { id: string }) {
    const newProfile = new Profile({
      id: data.id,
      name: data.name,
      email: data.email,
      is2faEnabled: data.is2faEnabled,
      isVerified: data.isVerified,
      settings: [],
    })

    newProfile.setDefaultSettings()
    return newProfile
  }

  setDefaultSettings() {
    const settingsBuilder = new ProfileSettingsBuilder()
    this.data.settings = settingsBuilder
      .add(new TwoFactorSettingFactory().create())
      .add(new BackgroundColorSettingFactory().create())
      .build()
  }
}
