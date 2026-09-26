'use client'
import { Float } from '@react-three/drei'
import { useLayoutEffect, type ReactNode } from 'react'
import { useThree } from '@react-three/fiber'

export function SceneFloat({
  reducedMotion,
  radius = 1,
  children,
}: {
  reducedMotion: boolean
  radius?: number
  children: ReactNode
}) {
  const invalidate = useThree((state) => state.invalidate)
  useLayoutEffect(() => {
    invalidate()
  }, [reducedMotion, invalidate])
  // Removing Float resets its animated transform instead of freezing its last offset.
  return reducedMotion ? (
    <group>{children}</group>
  ) : (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={1}
      floatingRange={[-radius * 0.01, radius * 0.01]}
    >
      {children}
    </Float>
  )
}
