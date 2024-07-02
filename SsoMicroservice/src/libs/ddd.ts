import { randomUUID } from "crypto"

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

export abstract class BaseError extends Error {
  readonly code: string
  readonly message: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.message = message
  }
}

export class PermissionDeniedError extends BaseError {
  private static readonly code = "ERR_PERMISSION_DENIED"

  constructor(message: string = "Permission denied") {
    super(PermissionDeniedError.code, message)
  }
}

export class BadRequestError extends BaseError {
  private static readonly code = "ERR_BAD_REQUEST"

  constructor(message: string) {
    super(BadRequestError.code, message)
  }
}

export class ValidationError extends BaseError {
  private static readonly code = "ERR_VALIDATION_ERROR"

  constructor(message: string) {
    super(ValidationError.code, message)
  }
}

export class UnauthorizedError extends BaseError {
  private static readonly code = "ERR_UNAUTHORIZED"

  constructor(message: string = "Unauthorized") {
    super(UnauthorizedError.code, message)
  }
}
