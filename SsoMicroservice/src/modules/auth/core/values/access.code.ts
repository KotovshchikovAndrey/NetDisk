import { ValueObject } from "@libs/ddd/value"

export type IAccessCodeProps = {
  code: string
  createdAt: Date
  expiredAt: Date
  objective: AccessCodeObjective
}

export enum AccessCodeObjective {
  VerifySignUp = "VERIFY_SIGN_UP",
  ChangePassword = "CHANGE_PASSWORD",
}

export class AccessCode extends ValueObject<IAccessCodeProps> {
  static readonly ttl = 60 * 60 * 7 // 7 hours
  static readonly lengthOfCode = 6

  constructor(value: IAccessCodeProps) {
    super(value)
  }

  isExpired(): boolean {
    const utcNow = new Date(Math.floor(Date.now()))
    return this.value.expiredAt <= utcNow
  }

  protected validate(value: IAccessCodeProps): void {
    if (value.code.length != AccessCode.lengthOfCode)
      throw Error(
        `Invalid code length! Expected length=${AccessCode.lengthOfCode}`,
      )
  }
}
