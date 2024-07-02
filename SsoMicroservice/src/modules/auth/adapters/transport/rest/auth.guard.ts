import { AuthService } from "@modules/auth/core/services/auth.service"
import { SessionService } from "@modules/auth/core/services/session.service"
import {
  PermissionDeniedError,
  UnauthorizedError,
} from "@modules/common/errors"
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common"

@Injectable()
export class DeviceGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const deviceId = request.cookies["device_id"]
    if (!deviceId) {
      throw new BadRequestException("Device id missing")
    }

    request.device = deviceId
    return true
  }
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const session_id = request.cookies["session_id"]
    const session = await this.sessionService.get(session_id)

    request.session = session
    return true
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const refreshToken = request.cookies["refresh_token"]
    if (!refreshToken) {
      throw new PermissionDeniedError()
    }

    return true
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authorization: string = request.headers["authorization"]
    if (!authorization || !authorization.trim()) {
      throw new UnauthorizedError()
    }

    const accessToken = authorization.split(" ")[1]
    const currentUser = await this.authService.authenticate(accessToken)

    request.user = currentUser
    return true
  }
}
