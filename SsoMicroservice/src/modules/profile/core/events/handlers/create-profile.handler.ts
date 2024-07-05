import { IDomainEventHandler } from "@libs/ddd/event"
import { Inject, Injectable } from "@nestjs/common"
import { IProfileRepository } from "../../ports/profile.repository"
import { Profile } from "../../entities/profile"
import { PROFILE_REPOSITORY_PROVIDER } from "../../config/settings"
import { OnEvent } from "@nestjs/event-emitter"
import { UserSignedUpEvent } from "@modules/auth/core/events/auth.events"

@Injectable()
export class CreateProfileHandler
  implements IDomainEventHandler<UserSignedUpEvent>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PROVIDER)
    private readonly repository: IProfileRepository,
  ) {}

  @OnEvent("user.signed-up")
  async handle(event: UserSignedUpEvent) {
    try {
      const newProfile = Profile.createForUser(event.user)
      return this.repository.save(newProfile)
    } catch (err) {
      // log error
    }
  }
}
