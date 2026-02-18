import axios from 'axios'
import { EmailAdapter, SendEmailOptions } from 'payload'

const brevoAdapter = (): EmailAdapter => {
  const adapter: EmailAdapter = () => ({
    name: 'brevo',
    defaultFromAddress: process.env.BREVO_SENDER_EMAIL || '',
    defaultFromName: process.env.BREVO_SENDER_NAME || '',
    sendEmail: async (message: SendEmailOptions): Promise<unknown> => {
      if (process.env.BREVO_EMAILS_ENABLED !== '1') {
        console.info('emails disabled')
        console.info(message)
        return
      }

      try {
        const res = await axios.post(
          process.env.BREVO_API_URL || '',
          {
            sender: {
              name: process.env.BREVO_SENDER_NAME || '',
              email: process.env.BREVO_SENDER_EMAIL || '',
            },
            to: [{ email: message.to }],
            subject: message.subject,
            htmlContent: message.html,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.BREVO_API_KEY || '',
            },
          },
        )
        console.info('email sent with brevo', message.to)
        return res.data
      } catch (error) {
        console.error('error sending email with brevo', error)
      }
    },
  })
  return adapter
}

export default brevoAdapter
