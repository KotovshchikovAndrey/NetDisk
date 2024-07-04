import { IDomainEventHandler } from "@libs/ddd/event"
import { UserCreatedEvent } from "@modules/auth/core/events/user.created"
import { Inject, Injectable } from "@nestjs/common"
import { IProfileRepository } from "../../ports/profile.repository"
import { Profile } from "../../entities/profile"
import { PROFILE_REPOSITORY_PROVIDER } from "../../config/settings"

@Injectable()
export class CreateProfileHandler
  implements IDomainEventHandler<UserCreatedEvent>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PROVIDER)
    private readonly repository: IProfileRepository,
  ) {}

  async handle(event: UserCreatedEvent) {
    const newProfile = Profile.createForUser(event.user)
    this.repository.save(newProfile)
  }
}
