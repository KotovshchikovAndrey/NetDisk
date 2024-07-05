import {
  MultipleSetting,
  Setting,
  SingleSetting,
  ToggleSetting,
} from "@modules/profile/core/entities/setting"
import {
  MultipleSettingModel,
  MyMultipleSetting,
  MySetting,
  MySingleSetting,
  MyToggleSetting,
  ProfileModel,
  SettingModel,
  SingleSettingModel,
  ToggleSettingModel,
} from "./model"
import { Profile } from "@modules/profile/core/entities/profile"
import { Email } from "@modules/common/values/email"

export class SettingMapper {
  static toDomain(model: SettingModel) {
    if ("is_enabled" in model) {
      return ToggleSettingMapper.toDomain(model)
    }

    if ("selected_option" in model) {
      return SingleSettingMapper.toDomain(model)
    }

    if ("selected_options" in model) {
      return MultipleSettingMapper.toDomain(model)
    }
  }

  static fromDomain(entity: Setting) {
    if (entity instanceof ToggleSetting) {
      return ToggleSettingMapper.fromDomain(entity)
    }

    if (entity instanceof SingleSetting) {
      return SingleSettingMapper.fromDomain(entity)
    }

    if (entity instanceof MultipleSetting) {
      return MultipleSettingMapper.fromDomain(entity)
    }
  }
}

class ToggleSettingMapper {
  static toDomain(model: ToggleSettingModel) {
    return new ToggleSetting({
      id: model._id,
      isEnabled: model.is_enabled,
    })
  }

  static fromDomain(entity: ToggleSetting) {
    const model = new ToggleSettingModel()
    model._id = entity.id
    model.is_enabled = entity.isEnabled
    return model
  }
}

class SingleSettingMapper {
  static toDomain(model: SingleSettingModel) {
    return new SingleSetting({
      id: model._id,
      allowedOptions: new Set(model.allowed_options),
      selectedOption: model.selected_option,
    })
  }

  static fromDomain(entity: SingleSetting) {
    const model = new SingleSettingModel()
    model._id = entity.id
    model.allowed_options = [...entity.allowedOptions]
    model.selected_option = entity.selectedOption
    return model
  }
}

class MultipleSettingMapper {
  static toDomain(model: MultipleSettingModel) {
    return new MultipleSetting({
      id: model._id,
      allowedOptions: new Set(model.allowed_options),
      selectedOptions: new Set(model.selected_options),
    })
  }

  static fromDomain(entity: MultipleSetting) {
    const model = new MultipleSettingModel()
    model._id = entity.id
    model.allowed_options = [...entity.allowedOptions]
    model.selected_options = [...entity.selectedOptions]
    return model
  }
}

export class ProfileMapper {
  static toDomain(model: ProfileModel) {
    let settings: Setting[] = []
    if (model.settings) {
      settings = model.settings.map((setting, index) => {
        if ("is_enabled" in setting) {
          const mySetting = <MyToggleSetting>model.my_settings[index]
          setting.is_enabled = mySetting.is_enabled
          return ToggleSettingMapper.toDomain(setting)
        }

        if ("selected_option" in setting) {
          const mySetting = <MySingleSetting>model.my_settings[index]
          setting.selected_option = mySetting.selected_option
          return SingleSettingMapper.toDomain(setting)
        }

        if ("selected_options" in setting) {
          const mySetting = <MyMultipleSetting>model.my_settings[index]
          setting.selected_options = mySetting.selected_options
          return MultipleSettingMapper.toDomain(setting)
        }
      })
    }

    return new Profile({
      id: model._id,
      name: model.name,
      email: new Email(model.email),
      is2faEnabled: model.is_2a_enabled,
      isVerified: model.is_verified,
      settings,
    })
  }

  static fromDomain(entity: Profile) {
    const model = new ProfileModel()
    model._id = entity.id
    model.name = entity.name
    model.email = entity.email.value
    model.is_2a_enabled = entity.is2faEnabled
    model.is_verified = entity.isVerified

    // because you neednt set empty settings
    if (entity.settings.length !== 0)
      model.my_settings = entity.settings.map((setting) => {
        if (setting instanceof ToggleSetting) {
          return {
            _id: setting.id,
            is_enabled: setting.isEnabled,
          }
        }

        if (setting instanceof SingleSetting) {
          return {
            _id: setting.id,
            selected_option: setting.selectedOption,
          }
        }

        if (setting instanceof MultipleSetting) {
          return {
            _id: setting.id,
            selected_options: [...setting.selectedOptions],
          }
        }
      })

    return model
  }
}
