import { AccessCode, AccessCodeObjective } from "../values/access.code"
import { addTimeToDate, getUtcNowDate } from "@libs/datetime"
import {
  ExpiredAccessCodeError,
  InvalidAccessCodeError,
} from "../errors/user.errors"
import { randomUUID } from "crypto"
import { comparePasswordHash, hashPassword } from "@libs/cryptography"
import { Email } from "../values/email"
import { Entity } from "@libs/ddd/entity"

type IUserData = {
  name: string
  email: Email
  secret: string
  isVerified: boolean
  is2faEnabled: boolean
  createdAt: Date
  lastLoginAt: Date
  hashedPassword: string
  accessCodes: AccessCode[]
}

type INewUserData = {
  name: string
  email: string
  password: string
}

export class User extends Entity<IUserData> {
  constructor({ id, ...data }: IUserData & { id?: string }) {
    super(data, id)
  }

  static async create(data: INewUserData) {
    return new User({
      name: data.name,
      email: new Email(data.email),
      secret: randomUUID(),
      createdAt: getUtcNowDate(),
      lastLoginAt: getUtcNowDate(),
      hashedPassword: await hashPassword(data.password),
      is2faEnabled: false,
      isVerified: false,
      accessCodes: [],
    })
  }

  async checkPassword(password: string) {
    return comparePasswordHash(password, this.hashedPassword)
  }

  issueAccessCode(objective: AccessCodeObjective): string {
    const code = this.generateCode(AccessCode.lengthOfCode)
    const newAccessCode = new AccessCode({
      code,
      objective,
      createdAt: getUtcNowDate(),
      expiredAt: addTimeToDate(getUtcNowDate(), AccessCode.ttl),
    })

    for (const [index, accessCode] of this.accessCodes.entries()) {
      if (accessCode.value.code === code) {
        this.data.accessCodes[index] = newAccessCode
        return code
      }
    }

    this.data.accessCodes.push(newAccessCode)
    return code
  }

  validateAccessCode(code: string, objective: AccessCodeObjective) {
    const index = this.accessCodes.findIndex(
      (accessCode) =>
        accessCode.value.objective === objective &&
        accessCode.value.code === code,
    )

    if (index === -1) {
      throw new InvalidAccessCodeError()
    }

    const accessCode = this.data.accessCodes[index]
    if (accessCode.isExpired()) {
      throw new ExpiredAccessCodeError()
    }

    // remove one-time code
    this.data.accessCodes.splice(index, 1)
  }

  verify() {
    this.data.isVerified = true
  }

  private generateCode(length: number): string {
    const code: number[] = []
    for (let index = 0; index < length; index++) {
      const codePart = Math.floor(Math.random() * 9)
      code.push(codePart)
    }

    while (code[0] === 0) {
      code[0] = Math.floor(Math.random() * 9)
    }

    return code.join("")
  }

  get name() {
    return this.data.name
  }

  get email() {
    return this.data.email
  }

  get secret() {
    return this.data.secret
  }

  get isVerified() {
    return this.data.isVerified
  }

  get is2faEnabled() {
    return this.data.is2faEnabled
  }

  get createdAt() {
    return this.data.createdAt
  }

  get lastLoginAt() {
    return this.data.lastLoginAt
  }

  get hashedPassword() {
    return this.data.hashedPassword
  }

  get accessCodes(): Readonly<AccessCode[]> {
    return this.data.accessCodes
  }
}
