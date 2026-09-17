import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/**
 * Fires Next's on-demand revalidation after any publish, in-process — no signed
 * HTTP round trip needed since Payload and Next share the same server/runtime.
 * ponytail: revalidates the whole site tag rather than per-slug; add per-doc
 * tags if build times or cache-miss rates ever justify the extra bookkeeping.
 */
async function revalidate() {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag('content')
  } catch {
    // no-op outside the Next request lifecycle (e.g. seed script)
  }
}

export const revalidateHook: CollectionAfterChangeHook = async () => {
  await revalidate()
}

export const revalidateGlobalHook: GlobalAfterChangeHook = async () => {
  await revalidate()
}
