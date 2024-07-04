import { IDomainEvent, IDomainEventHandler, IMediator } from "@libs/ddd/event"
import { SendVerificationCodeEmailHandler } from "@modules/auth/core/events/handlers/send.verification.code.email"
import { UserCreatedEvent } from "@modules/auth/core/events/user.created"
import { CreateProfileHandler } from "@modules/profile/core/events/handlers/create.profile"
import { Injectable } from "@nestjs/common"

type DomainEventClass = new (...args: unknown[]) => IDomainEvent

@Injectable()
export class Mediator implements IMediator {
  private readonly handlers: Map<
    DomainEventClass,
    IDomainEventHandler<IDomainEvent>[]
  > = new Map()

  constructor(
    sendVerificationCodeEmailHandler: SendVerificationCodeEmailHandler,
    createProfileHandler: CreateProfileHandler,
  ) {
    this.registerHandler(UserCreatedEvent, createProfileHandler)
    this.registerHandler(UserCreatedEvent, sendVerificationCodeEmailHandler)
  }

  async notify(events: IDomainEvent[]) {
    if (events.length === 0) {
      return
    }

    const notifications = []
    events.forEach((event) => {
      const handlers = this.handlers.get(<DomainEventClass>event.constructor)
      if (!handlers) {
        return
      }

      for (const handler of handlers) {
        notifications.push(handler.handle(event))
      }
    })

    await Promise.all(notifications)
  }

  private registerHandler<T extends IDomainEvent>(
    event: new (...args: unknown[]) => T,
    handler: IDomainEventHandler<T>,
  ) {
    const handlers = this.handlers.get(event)
    if (!handlers) {
      this.handlers.set(event, [])
    }

    this.handlers.get(event).push(handler)
  }
}
