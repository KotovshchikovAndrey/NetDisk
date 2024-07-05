import { Response } from "@modules/common/responses"
import { SettingSerive } from "@modules/profile/core/services/settings.service"
import { Controller, Post } from "@nestjs/common"

@Controller("settings")
export class SettingController {
  constructor(private readonly settingService: SettingSerive) {}

  @Post("default")
  async createDefaultSettings() {
    await this.settingService.createDefaultSettings()
    return new Response("Default settings created successfully", null)
  }
}
