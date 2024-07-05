import { Setting } from "./setting"
import { ProfileSettingsBuilder } from "../utils/profile.settings.builder"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "../utils/profile.settings.factory"
import { Entity } from "@libs/ddd/entity"
import { Email } from "@modules/common/values/email"

type ProfileData = {
  name: string
  email: Email
  is2faEnabled: boolean
  isVerified: boolean
  settings: Setting[]
}

export class Profile extends Entity<ProfileData> {
  constructor({ id, ...data }: ProfileData & { id: string }) {
    super(data, id)
  }

  static createForUser(data: Omit<ProfileData, "settings"> & { id: string }) {
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

  get name() {
    return this.data.name
  }

  get email() {
    return this.data.email
  }

  get isVerified() {
    return this.data.isVerified
  }

  get is2faEnabled() {
    return this.data.is2faEnabled
  }

  get settings(): Readonly<Setting[]> {
    return this.data.settings
  }
}
