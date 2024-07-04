import { IDomainEvent } from "@libs/ddd/event"
import { User } from "../entities/user"

export class UserCreatedEvent implements IDomainEvent {
  constructor(readonly user: User) {}
}
