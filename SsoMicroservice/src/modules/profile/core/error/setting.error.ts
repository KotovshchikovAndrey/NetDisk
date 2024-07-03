import { BaseError } from "@modules/common/error"

export class DefaultSettingsAlreadyExistsError extends BaseError {
  private static readonly code = "ERR_DEFAULT_SETTINGS_ALREADY_EXISTS"

  constructor(message: string = "Default settings already exists") {
    super(DefaultSettingsAlreadyExistsError.code, message)
  }
}
