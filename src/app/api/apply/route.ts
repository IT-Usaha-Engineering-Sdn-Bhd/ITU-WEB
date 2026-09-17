import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { applicationSchema, HONEYPOT_FIELD, MAX_CV_SIZE_BYTES, ALLOWED_CV_TYPES } from '@/lib/validation'
import { isRateLimited } from '@/lib/rateLimit'
import { sendNotification } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`apply:${ip}`)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again shortly.' }, { status: 429 })
  }

  const formData = await req.formData()
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === 'string'),
  ) as Record<string, string>

  if (typeof raw[HONEYPOT_FIELD] === 'string' && raw[HONEYPOT_FIELD].length > 0) {
    return NextResponse.json({ ok: true })
  }

  const parsed = applicationSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const cv = formData.get('cv')
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: 'A CV file is required', fieldErrors: { cv: ['A CV file is required'] } }, { status: 400 })
  }
  if (cv.size > MAX_CV_SIZE_BYTES) {
    return NextResponse.json({ error: 'CV file is too large (max 5MB)', fieldErrors: { cv: ['Max 5MB'] } }, { status: 400 })
  }
  if (!ALLOWED_CV_TYPES.includes(cv.type)) {
    return NextResponse.json({ error: 'CV must be a PDF or Word document', fieldErrors: { cv: ['PDF or Word only'] } }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const { applicantName, email, phone, position, coverMessage } = parsed.data

  const cvBuffer = Buffer.from(await cv.arrayBuffer())
  const cvDoc = await payload.create({
    collection: 'documents',
    data: { label: `CV — ${applicantName}` },
    file: { data: cvBuffer, mimetype: cv.type, name: cv.name, size: cv.size },
  })

  const retentionDate = new Date()
  retentionDate.setMonth(retentionDate.getMonth() + 6)

  await payload.create({
    collection: 'jobApplications',
    data: {
      applicantName,
      email,
      phone: phone || undefined,
      position: Number(position),
      coverMessage: coverMessage || undefined,
      cv: cvDoc.id,
      consentAt: new Date().toISOString(),
      processingStatus: 'new',
      retentionDate: retentionDate.toISOString(),
    },
  })

  const settings = await payload.findGlobal({ slug: 'siteSettings' })
  await sendNotification(settings?.notificationEmails?.careerTo, `New application from ${applicantName}`, coverMessage || '(no message)')

  return NextResponse.json({ ok: true })
}
