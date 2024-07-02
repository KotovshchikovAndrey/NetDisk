import { ValidationError, ValueObject } from "@libs/ddd"

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
