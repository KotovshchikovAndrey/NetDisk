export abstract class ValueObject<T> {
  protected readonly _value: T

  constructor(value: T) {
    this.validate(value)
    this._value = value
  }

  get value(): Readonly<T> {
    return this._value
  }

  protected abstract validate(value: T): void
}
