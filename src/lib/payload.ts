import { getPayload } from 'payload'
import config from '@/payload.config'

/** Cached local Payload instance for server components — no HTTP round trip. */
export const getPayloadClient = () => getPayload({ config })
