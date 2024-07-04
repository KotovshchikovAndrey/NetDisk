import { randomUUID } from "crypto"
import { IDomainEvent } from "./event"

export abstract class Entity<T> {
  protected readonly _id: string
  protected readonly data: T
  private readonly events: IDomainEvent[]

  constructor(data: T, id?: string) {
    this._id = id ?? randomUUID()
    this.data = data
    this.events = []
  }

  addEvent(event: IDomainEvent) {
    this.events.push(event)
  }

  publishEvents() {
    const events = [...this.events]
    this.events.length = 0
    return events
  }

  get id() {
    return this._id
  }
}
