import { Session } from "../entities/session"

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>
  save(session: Session): Promise<void>
  deleteById(id: string): Promise<void>
}
