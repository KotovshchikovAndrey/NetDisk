import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common"
import { SignInDto, SignUpDto, VerifyDto } from "./auth.dto"
import { AuthService } from "@modules/auth/core/services/auth.service"
import { Response } from "@modules/common/response"
import { Response as NestResponse } from "express"
import { SessionService } from "@modules/auth/core/services/session.service"
import {
  AuthGuard,
  DeviceGuard,
  RefreshTokenGuard,
  SessionGuard,
} from "./auth.guard"
import { DeviceId, RefreshToken, Session, User } from "./auth.decorator"
import { CurrentUser, SessionOutput } from "@modules/auth/core/dto/output"
import { generate2faQRCode } from "@libs/2fa.authenticator"

@UseGuards(DeviceGuard)
@Controller("auth")
export class AuthRestController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  @Post("sign-up")
  async signUp(@Body() dto: SignUpDto) {
    const output = await this.authService.signUp(dto)
    return new Response("User registered successfully", output)
  }

  @UseGuards(AuthGuard)
  @Get("verify")
  async verifyUser(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    dto: VerifyDto,
    @User() currentUser: CurrentUser,
    @DeviceId() deviceId: string,
  ) {
    await this.authService.verifyUser({
      deviceId,
      userId: currentUser.id,
      code: dto.code,
    })

    return new Response("User verified successfully", null)
  }

  @UseGuards(AuthGuard)
  @Get("verify/resend")
  async resendUserVerificationCode(@User() currentUser: CurrentUser) {
    await this.authService.resendUserVerificationCode(currentUser.id)
    return new Response("New code was resent successfully", null)
  }

  @Post("sign-in")
  async signIn(
    @Body() dto: SignInDto,
    @DeviceId() deviceId: string,
    @Res({ passthrough: true }) response: NestResponse,
  ) {
    const output = await this.authService.signIn({ ...dto, deviceId })
    const session = await this.sessionService.createForUser(output.userId)

    response.cookie("session_id", session.id, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    })

    if (!output.tokenPair) {
      return new Response("Required two-factor authentication", null)
    }

    const { accessToken, refreshToken } = output.tokenPair
    response.cookie("refresh_token", refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    })

    return new Response("Successful sign in", { accessToken })
  }

  @UseGuards(SessionGuard)
  @Get("2fa")
  async verify2faCode(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    dto: VerifyDto,
    @Session() session: SessionOutput,
    @DeviceId() deviceId: string,
    @Res({ passthrough: true }) response: NestResponse,
  ) {
    const output = await this.authService.verify2faCode({
      deviceId,
      code: dto.code,
      userId: session.userId,
    })

    const { accessToken, refreshToken } = output
    response.cookie("refresh_token", refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    })

    return new Response("User signed in successfully", { accessToken })
  }

  @UseGuards(AuthGuard)
  @Post("2fa")
  async generate2faQRCode(@User() currentUser: CurrentUser) {
    const qrcode = await generate2faQRCode({
      username: currentUser.name,
      service: "SOME_NAME",
      secret: currentUser.secret,
    })

    return new Response("QRCode for scan", { qrcode })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put("2fa")
  toggle2faAuthenication(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    dto: VerifyDto,
    @User() currentUser: CurrentUser,
  ) {
    return this.authService.toggle2faAuthentication({
      userId: currentUser.id,
      code: dto.code,
    })
  }

  @UseGuards(RefreshTokenGuard)
  @Put("refresh")
  async refreshTokenPair(
    @DeviceId() deviceId: string,
    @RefreshToken() token: string,
    @Res({ passthrough: true }) response: NestResponse,
  ) {
    const output = await this.authService.refreshTokenPair({
      deviceId,
      refreshToken: token,
    })

    const { accessToken, refreshToken } = output
    response.cookie("refresh_token", refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    })

    return new Response("Successful refresh tokens", { accessToken })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("sign-out")
  async signOut(
    @Res({ passthrough: true }) response: NestResponse,
    @Session() session?: SessionOutput,
    @RefreshToken() refreshToken?: string,
  ) {
    await Promise.all([
      refreshToken && this.authService.signOut(refreshToken),
      session && this.sessionService.invalidate(session.id),
    ])

    response.clearCookie("refresh_token")
    response.clearCookie("session_id")
  }
}
