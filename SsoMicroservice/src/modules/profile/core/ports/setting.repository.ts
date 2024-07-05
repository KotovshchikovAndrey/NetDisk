import { Setting } from "../entities/setting"

export interface ISettingRepository {
  findById(id: string): Promise<Setting | null>
  save(...settings: Setting[]): Promise<void>
  isEmpty(): Promise<boolean>
}
