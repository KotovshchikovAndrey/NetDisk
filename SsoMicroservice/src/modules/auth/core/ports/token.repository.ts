import { Token } from "../entities/token"

export interface ITokenRepository {
  findById(id: string): Promise<Token | null>
  save(token: Token): Promise<void>
  revokeById(id: string): Promise<void>
  revokeByUserDevice(userId: string, deviceId: string): Promise<void>
  revokeByUser(userId: string): Promise<void>
  removeExpired(): Promise<void>
}
