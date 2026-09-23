export type ContactData = {
  name: string
  email: string
  phone: string
  companyName: string
  companyAddress: string
  message: string
}

const limits: Record<keyof ContactData, number> = {
  name: 120,
  email: 254,
  phone: 40,
  companyName: 200,
  companyAddress: 1000,
  message: 5000,
}

export function validateContact(
  input: unknown,
): { ok: true; data: ContactData } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { ok: false, error: 'Invalid enquiry.' }
  const record = input as Record<string, unknown>
  if (Object.keys(record).some((key) => !(key in limits)))
    return { ok: false, error: 'Invalid enquiry.' }
  const data = {} as ContactData
  for (const key of Object.keys(limits) as (keyof ContactData)[]) {
    const value = record[key] ?? ''
    if (typeof value !== 'string' || value.trim().length > limits[key])
      return { ok: false, error: `Check ${key}.` }
    data[key] = value.trim()
  }
  if (
    !data.name ||
    !data.phone ||
    !data.message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    return { ok: false, error: 'Enter your name, a valid email, phone number and message.' }
  }
  return { ok: true, data }
}
