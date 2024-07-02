import * as jwt from "jsonwebtoken"

export class JwtExpiredError extends Error {
  constructor() {
    super("Token expired")
  }
}

export class InvalidJwtError extends Error {
  constructor() {
    super("Invalid token")
  }
}

export type IJwtPayload = {
  jti: string
  sub: string
  iat: number
  exp: number
}

export const generateRS256Jwt = (payload: IJwtPayload, privateKey: string) => {
  return jwt.sign(payload, privateKey, { algorithm: "RS256" })
}

export const validateRS256Jwt = (token: string, publicKey: string) => {
  try {
    const payload = jwt.verify(token, publicKey)
    return payload as IJwtPayload
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new JwtExpiredError()
    } else {
      throw new InvalidJwtError()
    }
  }
}

export const decodeJwt = (token: string) => {
  try {
    const payload = jwt.decode(token)
    return payload as IJwtPayload
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new InvalidJwtError()
    }
  }
}
