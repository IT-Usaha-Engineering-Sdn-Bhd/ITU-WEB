/** No-ops until RESEND_API_KEY is set — nothing blocks on picking an email provider. */
export async function sendNotification(to: string | undefined | null, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY || !to) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL ?? 'no-reply@itusaha.com',
      to,
      subject,
      text,
    }),
  })
}
