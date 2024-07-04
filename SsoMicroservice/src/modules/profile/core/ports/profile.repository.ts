import { Profile } from "../entities/profile"

export interface IProfileRepository {
  save(profile: Profile): Promise<void>
}
