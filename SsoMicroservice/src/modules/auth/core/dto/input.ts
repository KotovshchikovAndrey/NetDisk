export class SignUpInput {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}
}

export class SignInInput {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly deviceId: string,
  ) {}
}

export class RefreshTokenInput {
  constructor(readonly deviceId: string, readonly refreshToken: string) {}
}

export class VerifyInput {
  constructor(
    readonly userId: string,
    readonly deviceId: string,
    readonly code: string,
  ) {}
}

export class Toggle2faAuthenicationInput {
  constructor(readonly userId: string, readonly code: string) {}
}
