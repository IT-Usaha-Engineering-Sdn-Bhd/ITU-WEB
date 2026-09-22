'use client'

import { useLayoutEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'

// drei's <PerspectiveCamera> has no `lookAt` prop — one shared rig instead of repeating a
// useLayoutEffect + ref in every scene that needs to aim its camera at something.
export function CameraRig({
  position,
  target,
  fov = 45,
  far = 100,
}: {
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
  far?: number
}) {
  const ref = useRef<PerspectiveCameraImpl>(null)

  useLayoutEffect(() => {
    ref.current?.lookAt(...target)
  }, [target])

  return <PerspectiveCamera makeDefault ref={ref} position={position} fov={fov} near={0.1} far={far} />
}
