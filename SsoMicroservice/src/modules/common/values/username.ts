import { ValueObject } from "@libs/ddd/value"
import { ValidationError } from "../errors"

export class Username extends ValueObject<string> {
  private readonly maxLenghth = 50

  constructor(value: string) {
    super(value.trim())
  }

  getName() {
    return this.value.split(" ")[0]
  }

  getSurname() {
    return this.value.split(" ")[1]
  }

  protected validate(value: string): void {
    if (value.length > this.maxLenghth) {
      throw new ValidationError(
        `Too long username. Expected length <= ${this.maxLenghth}`,
      )
    }

    const fullName = value.split(" ")
    if (fullName.length != 2) {
      throw new ValidationError(
        "Invalid username format. Expected '{name} {surname}'",
      )
    }
  }
}
