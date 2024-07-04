export interface IDomainEvent {}

export interface IDomainEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>
}

export interface IMediator {
  notify(events: IDomainEvent[]): Promise<void>
}
