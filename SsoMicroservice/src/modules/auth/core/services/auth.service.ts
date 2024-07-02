import { Inject, Injectable } from "@nestjs/common"
import { IUserRepository } from "../ports/user.repository"
import { USER_REPOSITORY_PROVIDER } from "../configs/settings"
import {
  RefreshTokenInput,
  SignInInput,
  SignUpInput,
  VerifyInput,
} from "../dto/input"
import { User } from "../entities/user"
import { sendEmail } from "@libs/email"
import { CurrentUser, SignInOutput, SignUpOutput } from "../dto/output"
import { AccessCodeObjective } from "../values/access.code"
import { TokenService } from "./token.service"
import { check2faCode } from "@libs/2fa.authenticator"
import {
  Disabled2faAuthenticationError,
  Invalid2faCodeError,
  InvalidLoginOrPasswordError,
  OccupiedEmailError,
  UserAlreadyVerifiedError,
  UserNotFoundError,
  UserUnverifiedError,
} from "../errors/user.errors"
import { UnauthorizedError } from "@modules/common/errors"

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repository: IUserRepository,
    private readonly tokenService: TokenService,
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

    const code = newUser.issueAccessCode(AccessCodeObjective.VerifySignUp)
    await this.repository.save(newUser)
    this.sendVerificationCodeEmail(newUser.email.value, code)

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
      throw new UserAlreadyVerifiedError()
    }

    user.validateAccessCode(input.code, AccessCodeObjective.VerifySignUp)
    user.verify()

    this.repository.save(user)
  }

  async resendUserVerificationCode(userId: string) {
    const user = await this.repository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.isVerified) {
      throw new UserAlreadyVerifiedError()
    }

    const code = user.issueAccessCode(AccessCodeObjective.VerifySignUp)
    this.sendVerificationCodeEmail(user.email.value, code)
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
      throw new Disabled2faAuthenticationError()
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

    return new CurrentUser(user.id, user.email.value)
  }

  private async sendVerificationCodeEmail(email: string, code: string) {
    try {
      await sendEmail({
        smtpHost: "",
        smtpPort: 532,
        from: "",
        fromPassword: "",
        to: email,
        subject: "Верификация аккаунта на NetDisk",
        body: `Код для верификации: ${code}`,
      })
    } catch (err) {
      // log error
      // send to broker for retry
    }
  }
}
