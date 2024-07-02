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

export class InternalError extends BaseError {
  private static readonly code = "ERR_INTERNAL"

  constructor(message: string = "Internal server error") {
    super(InternalError.code, message)
  }
}
