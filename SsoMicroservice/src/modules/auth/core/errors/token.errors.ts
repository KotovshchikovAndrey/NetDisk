import { BaseError } from "@libs/ddd"

export class InvalidTokenError extends BaseError {
  private static readonly code = "ERR_INVALID_TOKEN"

  constructor(message: string = "Invalid token") {
    super(InvalidTokenError.code, message)
  }
}

export class TokenExpiredError extends BaseError {
  private static readonly code = "ERR_TOKEN_EXPIRED"

  constructor(message: string = "Token expired") {
    super(TokenExpiredError.code, message)
  }
}
