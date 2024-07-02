import qrcode from "qrcode"
import { authenticator } from "otplib"

export type IQrCodePayload = {
  userSecret: string
  serviceName: string
  userId: string
}

const generate2faQrCode = async (payload: IQrCodePayload) => {
  const otpauth = authenticator.keyuri(
    payload.userId,
    payload.serviceName,
    payload.userSecret,
  )

  return qrcode.toDataURL(otpauth)
}

export const check2faCode = (code: string, userSecret: string) =>
  authenticator.check(code, userSecret)
