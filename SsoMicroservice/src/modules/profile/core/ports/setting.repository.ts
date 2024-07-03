import { ISetting } from "../entities/setting"

export interface ISettingRepository {
  findById(id: string): Promise<ISetting | null>
  save(...settings: ISetting[]): Promise<void>
  isEmpty(): Promise<boolean>
}
