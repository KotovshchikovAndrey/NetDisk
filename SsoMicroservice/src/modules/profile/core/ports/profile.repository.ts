import { Profile } from "../entities/profile"

export interface IProfileRepository {
  findById(
    id: string,
    { fetchSettings }: { fetchSettings: boolean },
  ): Promise<Profile | null>
  save(profile: Profile): Promise<void>
}
