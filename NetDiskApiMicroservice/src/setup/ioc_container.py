import injector


class InfrastructureProvider(injector.Module):
    @injector.provider
    def provide_ping_message(self) -> str:
        return "pong"


container = injector.Injector([InfrastructureProvider])
