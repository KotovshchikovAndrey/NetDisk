import { ValueObject } from "@libs/ddd/value"
import { ValidationError } from "@modules/common/error"

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super(value)
  }

  protected validate(value: string) {
    const regex = /^[a-z_]+@(?:mail.ru|gmail.com)/
    if (!regex.test(value)) {
      throw new ValidationError("Invalid email")
    }
  }
}
