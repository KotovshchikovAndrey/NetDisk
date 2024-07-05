import { Inject, Injectable } from "@nestjs/common"
import { SettingSerive } from "./settings.service"
import { ChangeProfileFieldsInput } from "../dto/inputs"
import { PROFILE_REPOSITORY_PROVIDER } from "../config/settings"
import { IProfileRepository } from "../ports/profile.repository"
import { NotFoundError } from "@modules/common/errors"

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY_PROVIDER)
    private readonly repository: IProfileRepository,
    private readonly settingServive: SettingSerive,
  ) {}

  async changeProfileFields(input: ChangeProfileFieldsInput) {
    const isNoChanges = Object.keys(input).length === 1
    if (isNoChanges) {
      return
    }

    const profile = await this.repository.findById(input.id, {
      fetchSettings: false,
    })

    if (!profile) {
      throw new NotFoundError("Profile not found")
    }

    input.name && profile.changeName(input.name)
    return this.repository.save(profile)
  }
}
