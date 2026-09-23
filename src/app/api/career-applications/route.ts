import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { findOpenVacancy } from '@/lib/listings'
import { validateApplication, isPdf } from '@/lib/career-validation'
import { readBodyCapped } from '@/lib/read-body'

const MAX_BODY_BYTES = 6 * 1024 * 1024

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin)
    return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 })
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data'))
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 415 })
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES)
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })

  let form: FormData
  try {
    const body = await readBodyCapped(request, MAX_BODY_BYTES)
    if (!body) return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    form = await new Response(body, {
      headers: { 'content-type': request.headers.get('content-type')! },
    }).formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  if (form.get('website')) return NextResponse.json({ ok: true }) // honeypot

  const result = validateApplication({
    name: form.get('name'),
    email: form.get('email'),
    phone: form.get('phone'),
    vacancy: form.get('vacancy'),
    introduction: form.get('introduction'),
  })
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  const resume = form.get('resume')
  if (!(resume instanceof File))
    return NextResponse.json({ error: 'Attach your résumé.' }, { status: 400 })
  const resumeBytes = new Uint8Array(await resume.arrayBuffer())
  if (!isPdf({ name: resume.name, type: resume.type, size: resume.size }, resumeBytes)) {
    return NextResponse.json({ error: 'Résumé must be a valid PDF under 5MB.' }, { status: 400 })
  }

  const vacancy = await findOpenVacancy(result.data.vacancy)
  if (!vacancy)
    return NextResponse.json({ error: 'That position is no longer open.' }, { status: 409 })

  const payload = await getPayloadClient()

  let resumeDoc: { id: number } | undefined
  try {
    resumeDoc = await payload.create({
      collection: 'resumes',
      data: {},
      file: {
        data: Buffer.from(resumeBytes),
        mimetype: 'application/pdf',
        name: `resume-${crypto.randomUUID()}.pdf`,
        size: resumeBytes.byteLength,
      },
      overrideAccess: true,
    })
    await payload.create({
      collection: 'job-applications',
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        vacancy: vacancy.id,
        vacancyTitle: vacancy.title,
        introduction: result.data.introduction,
        resume: resumeDoc.id,
        status: 'new',
      },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Unable to save career application', error)
    if (resumeDoc)
      await payload
        .delete({ collection: 'resumes', id: resumeDoc.id, overrideAccess: true })
        .catch(() => {})
    return NextResponse.json(
      { error: 'Your application could not be saved. Please try again.' },
      { status: 503 },
    )
  }
}
