// ponytail: in-process Map, resets per serverless instance and isn't shared across
// regions — fine for a low-traffic contact/career form. Swap for Upstash Redis if
// spam volume ever makes that ceiling a real problem.
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  hits.set(key, timestamps)
  return timestamps.length > MAX_PER_WINDOW
}
