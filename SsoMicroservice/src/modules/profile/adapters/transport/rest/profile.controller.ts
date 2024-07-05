import { ProfileService } from "@modules/profile/core/services/profile.service"
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from "@nestjs/common"
import { ChangeProfileFieldsDto } from "./profile.dto"

@Controller("profiles")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  changeProfileFields(
    @Param("id") id: string,
    @Body() dto: ChangeProfileFieldsDto,
  ) {
    return this.profileService.changeProfileFields({ id, ...dto })
  }
}
