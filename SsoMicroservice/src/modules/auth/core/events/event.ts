import { User } from "../entities/user"

export class UserSignedUpEvent {
  constructor(readonly user: User) {}
}
