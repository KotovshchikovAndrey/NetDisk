import { BaseError } from "@modules/common/error"

export class InvalidAccessCodeError extends BaseError {
  private static readonly code = "ERR_INVALID_ACCESS_CODE"

  constructor(message: string = "Invalid access code") {
    super(InvalidAccessCodeError.code, message)
  }
}

export class ExpiredAccessCodeError extends BaseError {
  private static readonly code = "ERR_EXPIRED_ACCESS_CODE"

  constructor(message: string = "Expired access code") {
    super(ExpiredAccessCodeError.code, message)
  }
}

export class OccupiedEmailError extends BaseError {
  private static readonly code = "ERR_OCCUPIED_EMAIL"

  constructor(message: string = "Email occupied by another user") {
    super(OccupiedEmailError.code, message)
  }
}

export class InvalidLoginOrPasswordError extends BaseError {
  private static readonly code = "ERR_INVALID_LOGIN_OR_PASSWORD"

  constructor(message: string = "Invalid login or password") {
    super(InvalidLoginOrPasswordError.code, message)
  }
}

export class UserNotFoundError extends BaseError {
  private static readonly code = "ERR_USER_NOT_FOUND"

  constructor(message: string = "User not found") {
    super(UserNotFoundError.code, message)
  }
}

export class UserUnverifiedError extends BaseError {
  private static readonly code = "ERR_USER_UNVERIFIED"

  constructor(message: string = "User unverified") {
    super(UserUnverifiedError.code, message)
  }
}

export class Invalid2faCodeError extends BaseError {
  private static readonly code = "ERR_INVALID_2FA_CODE"

  constructor(message: string = "Invalid code") {
    super(Invalid2faCodeError.code, message)
  }
}
