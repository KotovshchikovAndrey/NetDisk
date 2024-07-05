import * as qrcode from "qrcode"
import { authenticator } from "otplib"

export type IQrCodePayload = {
  secret: string
  service: string
  username: string
}

export const generate2faQRCode = async (payload: IQrCodePayload) => {
  const otpauth = authenticator.keyuri(
    payload.username,
    payload.service,
    getSecretFromString(payload.secret),
  )

  return qrcode.toDataURL(otpauth)
}

export const check2faCode = (code: string, secret: string) =>
  authenticator.check(code, getSecretFromString(secret))

const getSecretFromString = (str: string) =>
  Buffer.from(str).toString("base64").replaceAll("=", "").slice(0, 16)
