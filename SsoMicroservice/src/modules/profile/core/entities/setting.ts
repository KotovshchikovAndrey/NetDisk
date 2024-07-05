import { Entity } from "@libs/ddd/entity"
import { ValidationError } from "@modules/common/error"

export type SingleSettingData = {
  allowedOptions: Set<string>
  selectedOption: string
}

export type MultipleSettingData = {
  allowedOptions: Set<string>
  selectedOptions: Set<string>
}

export type ToggleSettingData = {
  isEnabled: boolean
}
export type Setting = SingleSetting | MultipleSetting | ToggleSetting

export class SingleSetting extends Entity<SingleSettingData> {
  constructor({ id, ...data }: SingleSettingData & { id?: string }) {
    super(data, id)
  }

  selectOption(option: string) {
    if (!this.allowedOptions.has(option)) {
      throw new ValidationError("Selected option does not exists")
    }

    this.data.selectedOption = option
  }

  get allowedOptions(): Readonly<Set<string>> {
    return this.data.allowedOptions
  }

  get selectedOption(): string {
    return this.data.selectedOption
  }
}

export class MultipleSetting extends Entity<MultipleSettingData> {
  constructor({ id, ...data }: MultipleSettingData & { id?: string }) {
    super(data, id)
  }

  selectOption(option: string) {
    if (!this.allowedOptions.has(option)) {
      throw new ValidationError("Selected option does not exists")
    }

    this.data.selectedOptions.add(option)
  }

  get allowedOptions(): Readonly<Set<string>> {
    return this.data.allowedOptions
  }

  get selectedOptions(): Readonly<Set<string>> {
    return this.data.selectedOptions
  }
}

export class ToggleSetting extends Entity<ToggleSettingData> {
  constructor({ id, ...data }: ToggleSettingData & { id?: string }) {
    super(data, id)
  }

  toggle() {
    this.data.isEnabled = !this.data.isEnabled
  }

  get isEnabled() {
    return this.data.isEnabled
  }
}
