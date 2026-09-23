// Guards against a missing/understated content-length header by counting bytes as they
// stream in, instead of trusting the header or buffering an unbounded body. Returns null
// only when the body exceeds maxBytes; throws (same as a malformed body) when there's no
// body at all, so callers can tell "too large" apart from "empty/invalid".
export async function readBodyCapped(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array | null> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('empty body')
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) return null
    chunks.push(value)
  }
  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}
