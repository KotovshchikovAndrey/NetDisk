import { IDomainEventHandler } from "@libs/ddd/event"
import { UserCreatedEvent } from "../user.created"
import { sendEmail } from "@libs/email"
import { ConfigService } from "@nestjs/config"
import { Inject, Injectable } from "@nestjs/common"
import { IUserRepository } from "../../ports/user.repository"
import { AccessCodeObjective } from "../../values/access.code"
import { USER_REPOSITORY_PROVIDER } from "../../configs/settings"

@Injectable()
export class SendVerificationCodeEmailHandler
  implements IDomainEventHandler<UserCreatedEvent>
{
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async handle({ user }: UserCreatedEvent) {
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
