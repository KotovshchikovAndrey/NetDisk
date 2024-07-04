import { Inject, Injectable } from "@nestjs/common"
import { IUserRepository } from "../ports/user.repository"
import { USER_REPOSITORY_PROVIDER } from "../configs/settings"
import {
  RefreshTokenInput,
  SignInInput,
  SignUpInput,
  Toggle2faAuthenicationInput,
  VerifyInput,
} from "../dto/input"
import { User } from "../entities/user"
import { sendEmail } from "@libs/email"
import { CurrentUser, SignInOutput, SignUpOutput } from "../dto/output"
import { AccessCodeObjective } from "../values/access.code"
import { TokenService } from "./token.service"
import { check2faCode } from "@libs/2fa.authenticator"
import {
  Invalid2faCodeError,
  InvalidLoginOrPasswordError,
  OccupiedEmailError,
  UserNotFoundError,
  UserUnverifiedError,
} from "../errors/auth.error"
import { ConflictError, UnauthorizedError } from "@modules/common/error"
import { ConfigService } from "@nestjs/config"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { UserSignedUpEvent } from "../events/event"

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signUp(input: SignUpInput) {
    const user = await this.repository.findByEmail(input.email)
    if (user) {
      throw new OccupiedEmailError()
    }

    const newUser = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
    })

    await this.repository.save(newUser)
    this.eventEmitter.emit("user.signed-up", new UserSignedUpEvent(newUser))

    return new SignUpOutput(newUser.id)
  }

  async signIn(input: SignInInput) {
    const user = await this.repository.findByEmail(input.email)
    if (!user) {
      throw new InvalidLoginOrPasswordError()
    }

    const isPassword = await user.checkPassword(input.password)
    if (!isPassword) {
      throw new InvalidLoginOrPasswordError()
    }

    if (user.is2faEnabled) {
      return new SignInOutput(user.id)
    }

    const tokenPair = await this.tokenService.issuePair(user.id, input.deviceId)
    return new SignInOutput(user.id, tokenPair)
  }

  async refreshTokenPair(input: RefreshTokenInput) {
    const payload = this.tokenService.decodeToken(input.refreshToken)
    const user = await this.repository.findById(payload.sub)
    if (!user) {
      throw new UserNotFoundError()
    }

    return this.tokenService.refreshPair(input.refreshToken)
  }

  async signOut(refreshToken: string) {
    this.tokenService.invalidateToken(refreshToken)
  }

  async verifyUser(input: VerifyInput) {
    const user = await this.repository.findById(input.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.isVerified) {
      throw new ConflictError("User already verified")
    }

    user.verify(input.code)
    return this.repository.save(user)
  }

  async resendUserVerificationCode(userId: string) {
    const user = await this.repository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.isVerified) {
      throw new ConflictError("User already verified")
    }

    const code = user.issueAccessCode(AccessCodeObjective.VerifySignUp)
    await this.repository.save(user)

    return sendEmail({
      smtpHost: this.configService.get<string>("SMTP_HOST"),
      smtpPort: this.configService.get<number>("SMTP_PORT"),
      user: this.configService.get<string>("SMTP_USER"),
      password: this.configService.get<string>("SMTP_PASSWORD"),
      from: `NetDisk: ${this.configService.get<string>("SMTP_FROM")}`,
      to: user.email.value,
      subject: "Верификация аккаунта на NetDisk",
      htmlBody: `<p>Код для верификации: <strong>${code}</strong></p>`,
    })
  }

  async verify2faCode(input: VerifyInput) {
    const user = await this.repository.findById(input.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (!user.isVerified) {
      throw new UserUnverifiedError()
    }

    if (!user.is2faEnabled) {
      throw new ConflictError("Two factor authentication disabled")
    }

    if (!check2faCode(input.code, user.secret)) {
      throw new Invalid2faCodeError()
    }

    return this.tokenService.issuePair(user.id, input.deviceId)
  }

  async authenticate(accessToken: string) {
    const payload = await this.tokenService.validateToken(accessToken)
    const user = await this.repository.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedError()
    }

    return new CurrentUser(user.id, user.name, user.email.value, user.secret)
  }

  async toggle2faAuthentication(input: Toggle2faAuthenicationInput) {
    const user = await this.repository.findById(input.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (!check2faCode(input.code, user.secret)) {
      throw new Invalid2faCodeError()
    }

    user.toggle2faAuthentication()
    return this.repository.save(user)
  }
}
