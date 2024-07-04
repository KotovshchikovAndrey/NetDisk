import { randomUUID } from "crypto"
import { IDomainEvent } from "./event"

export abstract class Entity<T> {
  protected readonly _id: string
  protected readonly data: T

  constructor(data: T, id?: string) {
    this._id = id ?? randomUUID()
    this.data = data
  }

  get id() {
    return this._id
  }
}
