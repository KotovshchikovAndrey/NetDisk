import * as nodemailer from "nodemailer"

type EmailMessage = {
  user: string
  password: string
  from: string
  to: string
  smtpHost: string
  smtpPort: number
  subject: string
  htmlBody: string
}

export const sendEmail = async (email: EmailMessage) => {
  const mailer = nodemailer.createTransport({
    host: email.smtpHost,
    port: email.smtpPort,
    secure: false,
    auth: {
      user: email.user,
      pass: email.password,
    },
  })

  await mailer.sendMail({
    from: email.from,
    to: email.to,
    subject: email.subject,
    html: email.htmlBody,
  })

  mailer.close()
}
