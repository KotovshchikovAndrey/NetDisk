import {
  InvalidTokenError,
  TokenExpiredError,
} from "@modules/auth/core/errors/token.error"
import {
  Disabled2faAuthenticationError,
  ExpiredAccessCodeError,
  Invalid2faCodeError,
  InvalidAccessCodeError,
  InvalidLoginOrPasswordError,
  OccupiedEmailError,
  UserAlreadyVerifiedError,
  UserNotFoundError,
} from "@modules/auth/core/errors/user.error"
import {
  PermissionDeniedError,
  UnauthorizedError,
  ValidationError,
} from "@modules/common/error"
import { DefaultSettingsAlreadyExistsError } from "@modules/profile/core/error/setting.error"
import { HttpStatus } from "@nestjs/common"

export class HttpStatusMapper {
  getStatus(exception: unknown) {
    switch (exception.constructor) {
      case ValidationError:
        return HttpStatus.BAD_REQUEST

      case UnauthorizedError:
      case TokenExpiredError:
      case InvalidLoginOrPasswordError:
        return HttpStatus.UNAUTHORIZED

      case UserNotFoundError:
        return HttpStatus.NOT_FOUND

      case InvalidAccessCodeError:
      case ExpiredAccessCodeError:
      case InvalidTokenError:
      case PermissionDeniedError:
      case Invalid2faCodeError:
        return HttpStatus.FORBIDDEN

      case OccupiedEmailError:
      case UserAlreadyVerifiedError:
      case DefaultSettingsAlreadyExistsError:
      case Disabled2faAuthenticationError:
        return HttpStatus.CONFLICT

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
