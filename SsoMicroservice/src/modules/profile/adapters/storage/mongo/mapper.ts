import {
  MultipleSetting,
  SingleSetting,
  ToggleSetting,
} from "@modules/profile/core/entities/setting"
import {
  MultipleSettingModel,
  SingleSettingModel,
  ToggleSettingModel,
} from "./model"

export class ToggleSettingMapper {
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

export class SingleSettingMapper {
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

export class MultipleSettingMapper {
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
