export type ApplicationData = {
  name: string
  email: string
  phone: string
  vacancy: string
  introduction: string
}

const limits: Record<keyof ApplicationData, number> = {
  name: 120, email: 254, phone: 40, vacancy: 200, introduction: 2000,
}

export function validateApplication(input: unknown): { ok: true; data: ApplicationData } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'Invalid application.' }
  const record = input as Record<string, unknown>
  if (Object.keys(record).some((key) => !(key in limits))) return { ok: false, error: 'Invalid application.' }
  const data = {} as ApplicationData
  for (const key of Object.keys(limits) as (keyof ApplicationData)[]) {
    const value = record[key] ?? ''
    if (typeof value !== 'string' || value.trim().length > limits[key]) return { ok: false, error: `Check ${key}.` }
    data[key] = value.trim()
  }
  if (!data.name || !data.phone || !data.vacancy || !data.introduction || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: 'Enter your name, a valid email, phone number, vacancy and introduction.' }
  }
  return { ok: true, data }
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024
const PDF_SIGNATURE = new TextEncoder().encode('%PDF-')

export function isPdf(file: { name: string; type: string; size: number }, bytes: Uint8Array): boolean {
  if (!file.name.toLowerCase().endsWith('.pdf')) return false
  if (file.type !== 'application/pdf') return false
  if (file.size > MAX_RESUME_BYTES || bytes.length > MAX_RESUME_BYTES) return false
  if (bytes.length < PDF_SIGNATURE.length) return false
  return PDF_SIGNATURE.every((byte, i) => bytes[i] === byte)
}
