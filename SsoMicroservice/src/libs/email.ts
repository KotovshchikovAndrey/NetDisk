type EmailMessage = {
  from: string
  fromPassword: string
  to: string
  smtpHost: string
  smtpPort: number
  subject: string
  body: string
}

export const sendEmail = async (email: EmailMessage) => {}
