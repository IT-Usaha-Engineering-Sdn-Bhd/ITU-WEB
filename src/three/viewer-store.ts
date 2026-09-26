'use client'
import { useSyncExternalStore } from 'react'
import type { ModelId } from './model-registry'
import type { Quality } from './model-policy'

export type ViewerRequest = {
  key: string
  id: ModelId
  host: HTMLElement
  state: string
  url: string
  near: boolean
  ratio: number
  enabled: boolean
  quality: Quality
  rotation: number
  reset: number
  drag: boolean
  parallax?: boolean
  ready: () => void
  failed: () => void
}
const requests = new Map<string, ViewerRequest>()
const listeners = new Set<() => void>()
let active: ViewerRequest | null = null
function publish() {
  active =
    Array.from(requests.values())
      .filter((r) => r.near && r.enabled)
      .sort((a, b) => b.ratio - a.ratio)[0] ?? null
  listeners.forEach((listener) => listener())
}
export function registerViewer(request: ViewerRequest) {
  requests.set(request.key, request)
  publish()
}
export function removeViewer(key: string) {
  requests.delete(key)
  publish()
}
export function useViewer() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => active,
    () => null,
  )
}
