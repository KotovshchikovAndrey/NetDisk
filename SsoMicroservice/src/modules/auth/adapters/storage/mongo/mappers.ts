import { User } from "@modules/auth/core/entities/user"
import { TokenModel, UserModel } from "./models"
import { Token } from "@modules/auth/core/entities/token"
import { AccessCode } from "@modules/auth/core/values/access.code"
import { Email } from "@modules/common/values/email"
import { Username } from "@modules/common/values/username"

export class UserMapper {
  static toDomain(model: UserModel) {
    return new User({
      id: model._id,
      name: new Username(model.name),
      email: new Email(model.email),
      secret: model.secret,
      createdAt: model.created_at,
      lastLoginAt: model.last_login_at,
      hashedPassword: model.hashed_password,
      is2faEnabled: model.is_2a_enabled,
      isVerified: model.is_verified,
      accessCodes: model.access_codes.map(
        (value) =>
          new AccessCode({
            code: value.code,
            createdAt: value.created_at,
            expiredAt: value.expired_at,
            objective: value.objective,
          }),
      ),
    })
  }

  static fromDomain(entity: User) {
    const model = new UserModel()
    model._id = entity.id
    model.name = entity.name.value
    model.email = entity.email.value
    model.secret = entity.secret
    model.created_at = entity.createdAt
    model.last_login_at = entity.lastLoginAt
    model.is_verified = entity.isVerified
    model.hashed_password = entity.hashedPassword
    model.is_2a_enabled = entity.is2faEnabled
    model.access_codes = entity.accessCodes.map((accessCode) => ({
      code: accessCode.value.code,
      created_at: accessCode.value.createdAt,
      expired_at: accessCode.value.expiredAt,
      objective: accessCode.value.objective,
    }))

    return model
  }
}

export class TokenMapper {
  static toDomain(model: TokenModel) {
    return new Token({
      id: model._id,
      userId: model.user_id,
      deviceId: model.device_id,
      createdAt: model.created_at,
      expiredAt: model.expired_at,
      isRevoked: model.is_revoked,
    })
  }

  static fromDomain(entity: Token) {
    const model = new TokenModel()
    model._id = entity.id
    model.user_id = entity.userId
    model.device_id = entity.deviceId
    model.created_at = entity.createdAt
    model.expired_at = entity.expiredAt
    model.is_revoked = entity.isRevoked

    return model
  }
}
