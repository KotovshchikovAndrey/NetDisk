import { Module } from "@nestjs/common"
import { ApiExceptionFilter } from "./api.exception.filter"
import { AuthModule } from "@modules/auth/auth.module"
import { ProfileModule } from "@modules/profile/profile.module"
import { HttpStatusMapper } from "./utils/http.status.mapper"

@Module({
  imports: [AuthModule, ProfileModule],
  exports: [ApiExceptionFilter, HttpStatusMapper],
  providers: [ApiExceptionFilter, HttpStatusMapper],
})
export class ApiModule {}
