'use client'
import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { createTiltState, resetTilt, stepTilt } from './pointer-tilt'

export function usePointerTilt(
  group: RefObject<Group | null>,
  reducedMotion: boolean,
  intensity = { x: 0.03, y: 0.09 },
  enabled = true,
  reset = 0,
) {
  const state = useRef(createTiltState())
  const pointer = useRef({ x: 0, y: 0 })
  const invalidate = useThree((s) => s.invalidate)
  useLayoutEffect(() => {
    resetTilt(state.current)
    pointer.current = { x: 0, y: 0 }
    group.current?.rotation.set(0, 0, 0)
    invalidate()
    if (reducedMotion || !enabled) return
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.current = {
        x: (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        y: (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1,
      }
      invalidate()
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [group, reducedMotion, enabled, reset, invalidate])
  useFrame((_, delta) => {
    if (!group.current || reducedMotion || !enabled) return
    const settled = stepTilt(state.current, pointer.current, intensity, delta)
    group.current.rotation.x = state.current.rotation.x
    group.current.rotation.y = state.current.rotation.y
    if (!settled) invalidate()
  })
}
