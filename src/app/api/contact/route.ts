import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayloadClient } from '@/lib/payload'
import { contactSchema, HONEYPOT_FIELD } from '@/lib/validation'
import { isRateLimited } from '@/lib/rateLimit'
import { sendNotification } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again shortly.' }, { status: 429 })
  }

  const formData = await req.formData()
  const raw = Object.fromEntries(formData.entries())

  // honeypot: a bot that fills every field trips this; humans never see or fill it
  if (typeof raw[HONEYPOT_FIELD] === 'string' && raw[HONEYPOT_FIELD].length > 0) {
    return NextResponse.json({ ok: true }) // silently accept, write nothing
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const { name, email, phone, company, interest, message } = parsed.data
  await payload.create({
    collection: 'inquiries',
    data: {
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      interest: interest || undefined,
      message,
      consentAt: new Date().toISOString(),
      sourceUrl: req.headers.get('referer') ?? undefined,
      ipHash: crypto.createHash('sha256').update(ip).digest('hex'),
      status: 'new',
    },
  })

  const settings = await payload.findGlobal({ slug: 'siteSettings' })
  await sendNotification(settings?.notificationEmails?.contactTo, `New enquiry from ${name}`, message)

  return NextResponse.json({ ok: true })
}
