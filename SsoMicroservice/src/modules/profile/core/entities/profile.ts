import { Setting } from "./setting"
import { ProfileSettingsBuilder } from "../utils/profile.settings.builder"
import {
  BackgroundColorSettingFactory,
  TwoFactorSettingFactory,
} from "../utils/profile.settings.factory"
import { Entity } from "@libs/ddd/entity"
import { Email } from "@modules/common/values/email"
import { Username } from "@modules/common/values/username"
import { User } from "@modules/auth/core/entities/user"

type ProfileData = {
  name: Username
  email: Email
  is2faEnabled: boolean
  isVerified: boolean
  settings: Setting[]
}

export class Profile extends Entity<ProfileData> {
  constructor({ id, ...data }: ProfileData & { id: string }) {
    super(data, id)
  }

  static createForUser(user: User) {
    const newProfile = new Profile({
      id: user.id,
      name: user.name,
      email: user.email,
      is2faEnabled: user.is2faEnabled,
      isVerified: user.isVerified,
      settings: [],
    })

    newProfile.setDefaultSettings()
    return newProfile
  }

  changeName(newName: string) {
    this.data.name = new Username(newName)
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
