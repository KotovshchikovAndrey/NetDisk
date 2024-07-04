import { Global, Module } from "@nestjs/common"
import { Mediator } from "./mediator.service"
import { MEDIATOR_PROVIDER } from "@modules/common/settings"
import { AuthModule } from "@modules/auth/auth.module"
import { ProfileModule } from "@modules/profile/profile.module"

@Global()
@Module({
  imports: [AuthModule, ProfileModule],
  providers: [{ provide: MEDIATOR_PROVIDER, useClass: Mediator }],
  exports: [{ provide: MEDIATOR_PROVIDER, useClass: Mediator }],
})
export class MediatorModule {}
