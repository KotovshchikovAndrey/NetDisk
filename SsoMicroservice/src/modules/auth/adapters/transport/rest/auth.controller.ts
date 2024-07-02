import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common"
import { SignInDto, SignUpDto } from "./auth.dto"
import { AuthService } from "@modules/auth/core/services/auth.service"
import { Response } from "@libs/response"
import { Response as NestResponse } from "express"
import { SessionService } from "@modules/auth/core/services/session.service"
import { AuthGuard, DeviceGuard, SessionGuard } from "./auth.guard"
import { DeviceId, RefreshToken, Session, User } from "./auth.decorator"
import { CurrentUser, SessionOutput } from "@modules/auth/core/dto/output"

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
    @Query("code") code: string,
    @User() currentUser: CurrentUser,
    @DeviceId() deviceId: string,
  ) {
    await this.authService.verifyUser({
      code,
      deviceId,
      userId: currentUser.id,
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
  @Get("sign-in/2fa")
  async verify2faCode(
    @Query("code") code: string,
    @Session() session: SessionOutput,
    @DeviceId() deviceId: string,
    @Res({ passthrough: true }) response: NestResponse,
  ) {
    const output = await this.authService.verify2faCode({
      code,
      deviceId,
      userId: session.userId,
    })

    const { accessToken, refreshToken } = output
    response.cookie("refresh_token", refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    })

    return new Response("User signed in successfully", { accessToken })
  }

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

  @Delete("sign-out")
  async signOut(
    @Res({ passthrough: true }) response: NestResponse,
    @Session() session?: SessionOutput,
    @RefreshToken() refreshToken?: string,
  ) {
    await Promise.all([
      refreshToken && this.authService.signOut(refreshToken),
      session.id && this.sessionService.invalidate(session.id),
    ])

    response.clearCookie("refresh_token")
    response.clearCookie("session_id")
  }
}
