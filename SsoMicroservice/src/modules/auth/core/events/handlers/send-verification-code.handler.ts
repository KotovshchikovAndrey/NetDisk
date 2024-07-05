import { IDomainEventHandler } from "@libs/ddd/event"
import { sendEmail } from "@libs/email"
import { ConfigService } from "@nestjs/config"
import { Inject, Injectable } from "@nestjs/common"
import { IUserRepository } from "../../ports/user.repository"
import { AccessCodeObjective } from "../../values/access.code"
import { USER_REPOSITORY_PROVIDER } from "../../configs/settings"
import { OnEvent } from "@nestjs/event-emitter"
import { UserSignedUpEvent } from "../auth.events"

@Injectable()
export class SendVerificationCodeHandler
  implements IDomainEventHandler<UserSignedUpEvent>
{
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent("user.signed-up")
  async handle({ user }: UserSignedUpEvent) {
    const code = user.issueAccessCode(AccessCodeObjective.VerifySignUp)
    await this.repository.save(user)

    sendEmail({
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
}
