import { ProfileSettings } from "../config/enums"
import { ISetting, SingleSetting, ToggleSetting } from "../entities/setting"

abstract class ProfileSettingFactory {
  abstract create(): ISetting
}

export class TwoFactorSettingFactory extends ProfileSettingFactory {
  readonly default = false

  create() {
    return new ToggleSetting({
      id: ProfileSettings.TWO_FACTOR_AUTHENTICATION,
      isEnabled: this.default,
    })
  }
}

export class BackgroundColorSettingFactory extends ProfileSettingFactory {
  readonly default = "WHITE"
  readonly allowedOptions = new Set(["WHITE", "BLACK"])

  create() {
    return new SingleSetting({
      id: ProfileSettings.BACKGROUND_COLOR,
      allowedOptions: this.allowedOptions,
      selectedOption: this.default,
    })
  }
}
