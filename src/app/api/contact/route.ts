import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { validateContact } from '@/lib/contact-validation'
import { readBodyCapped } from '@/lib/read-body'

const MAX_BODY_BYTES = 32768

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin)
    return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 })
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ error: 'Expected JSON.' }, { status: 415 })
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES)
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  let value: unknown
  try {
    const body = await readBodyCapped(request, MAX_BODY_BYTES)
    if (!body) return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    value = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && 'website' in value) {
    const { website, ...rest } = value as Record<string, unknown>
    if (website) return NextResponse.json({ ok: true })
    value = rest
  }
  const result = validateContact(value)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: { ...result.data, status: 'new' },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Unable to save contact enquiry', error)
    return NextResponse.json(
      { error: 'Your message could not be saved. Please try again.' },
      { status: 503 },
    )
  }
}
