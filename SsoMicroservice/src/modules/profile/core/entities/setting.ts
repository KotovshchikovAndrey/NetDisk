import { Entity, ValidationError } from "@libs/ddd"

export type ISingleSettingData = {
  allowedOptions: Set<string>
  selectedOption: string
}

export type IMultipleSettingData = {
  allowedOptions: Set<string>
  selectedOptions: Set<string>
}

export type IToggleSettingData = {
  isEnabled: boolean
}

export type ISetting = SingleSetting | MultipleSetting | ToggleSetting

export class SingleSetting extends Entity<ISingleSettingData> {
  constructor({ id, ...data }: ISingleSettingData & { id?: string }) {
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

export class MultipleSetting extends Entity<IMultipleSettingData> {
  constructor({ id, ...data }: IMultipleSettingData & { id?: string }) {
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

export class ToggleSetting extends Entity<IToggleSettingData> {
  constructor({ id, ...data }: IToggleSettingData & { id?: string }) {
    super(data, id)
  }

  toggle() {
    this.data.isEnabled = !this.data.isEnabled
  }

  get isEnabled() {
    return this.data.isEnabled
  }
}
