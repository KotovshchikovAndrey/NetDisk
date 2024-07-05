import { Inject, Injectable } from "@nestjs/common"
import { ITokenRepository } from "../ports/token.repository"
import { TokenPairOutput } from "../dto/outputs"
import {
  JwtPayload,
  InvalidJwtError,
  JwtExpiredError,
  decodeJwt,
  generateRS256Jwt,
  validateRS256Jwt,
} from "@libs/jwt"
import { ConfigService } from "@nestjs/config"
import { readFile } from "fs/promises"
import { randomUUID } from "crypto"
import { getCurrentTimestamp } from "@libs/datetime"
import { Token } from "../entities/token"
import { TOKEN_REPOSITORY_PROVIDER } from "../configs/settings"
import {
  PermissionDeniedError,
  UnauthorizedError,
} from "@modules/common/errors"

@Injectable()
export class TokenService {
  constructor(
    @Inject(TOKEN_REPOSITORY_PROVIDER)
    private readonly repository: ITokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async issuePair(userId: string, deviceId: string) {
    const privateKey = await readFile(
      this.configService.get<string>("JWT_PRIVATE_KEY_PATH"),
    ).then((buffer) => buffer.toString())

    const accessTokenPayload: JwtPayload = {
      jti: randomUUID(),
      sub: userId,
      iat: getCurrentTimestamp(),
      exp: getCurrentTimestamp() + 60 * 30, // 30 minutes
    }

    const refreshTokenPayload: JwtPayload = {
      jti: randomUUID(),
      sub: userId,
      iat: getCurrentTimestamp(),
      exp: getCurrentTimestamp() + 60 * 60 * 24 * 7, // 1 week
    }

    const accessToken = generateRS256Jwt(accessTokenPayload, privateKey)
    const refreshToken = generateRS256Jwt(refreshTokenPayload, privateKey)

    const token = Token.create(refreshTokenPayload, deviceId)
    await this.repository.save(token)

    return new TokenPairOutput(accessToken, refreshToken)
  }

  async refreshPair(refreshToken: string) {
    const payload = await this.validateToken(refreshToken)
    const token = await this.repository.findById(payload.jti)
    if (!token) {
      throw new PermissionDeniedError()
    }

    if (token.isRevoked) {
      await this.repository.revokeByUser(payload.sub)
      throw new PermissionDeniedError()
    }

    await this.repository.revokeByUserDevice(token.userId, token.deviceId)
    return this.issuePair(token.userId, token.deviceId)
  }

  async invalidateToken(token: string) {
    const payload = this.decodeToken(token)
    this.repository.revokeById(payload.jti)
  }

  decodeToken(token: string) {
    try {
      const payload = decodeJwt(token)
      return payload
    } catch (err) {
      if (err instanceof InvalidJwtError) {
        throw new PermissionDeniedError()
      }
    }
  }

  async validateToken(token: string) {
    const path = this.configService.get("JWT_PUBLIC_KEY_PATH")
    try {
      const publicKey = await readFile(path).then((value) => value.toString())
      return validateRS256Jwt(token, publicKey)
    } catch (err) {
      if (err instanceof JwtExpiredError) {
        throw new UnauthorizedError()
      }

      if (err instanceof InvalidJwtError) {
        throw new PermissionDeniedError()
      }
    }
  }
}
