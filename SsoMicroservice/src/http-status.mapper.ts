import {
  ExpiredAccessCodeError,
  Invalid2faCodeError,
  InvalidAccessCodeError,
  InvalidLoginOrPasswordError,
  OccupiedEmailError,
  UserNotFoundError,
} from "@modules/auth/core/errors/auth.error"
import {
  ConflictError,
  PermissionDeniedError,
  UnauthorizedError,
  ValidationError,
} from "@modules/common/error"
import { HttpStatus } from "@nestjs/common"

export class HttpStatusMapper {
  getStatus(exception: unknown) {
    switch (exception.constructor) {
      case ValidationError:
        return HttpStatus.BAD_REQUEST

      case UnauthorizedError:
      case InvalidLoginOrPasswordError:
        return HttpStatus.UNAUTHORIZED

      case UserNotFoundError:
        return HttpStatus.NOT_FOUND

      case InvalidAccessCodeError:
      case ExpiredAccessCodeError:
      case PermissionDeniedError:
      case Invalid2faCodeError:
        return HttpStatus.FORBIDDEN

      case ConflictError:
      case OccupiedEmailError:
        return HttpStatus.CONFLICT

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
