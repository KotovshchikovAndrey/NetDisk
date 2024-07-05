export class TokenPairOutput {
  constructor(readonly accessToken: string, readonly refreshToken: string) {}
}

export class SignUpOutput {
  constructor(readonly userId: string) {}
}

export class SignInOutput {
  constructor(readonly userId: string, readonly tokenPair?: TokenPairOutput) {}
}

export class SessionOutput {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly createdAt: Date,
    readonly expiredAt: Date,
  ) {}
}

export class CurrentUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly secret: string,
  ) {}
}

// export class Enable2faAuthenticationOutput {
//   constructor(private readonly qrcodeUrl: string) {}
// }
