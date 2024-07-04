import { Profile } from "@modules/profile/core/entities/profile"
import { IProfileRepository } from "@modules/profile/core/ports/profile.repository"

export class ProfileMongoRepository implements IProfileRepository {
  async save(profile: Profile) {
    console.log("save profile")
  }
}
