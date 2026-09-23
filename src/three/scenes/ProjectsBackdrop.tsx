'use client'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { DataCentre } from '@/three/DataCentre'
import { CameraRig } from '@/three/CameraRig'

export function ProjectsBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const { invalidate, size } = useThree()

  // The canvas itself is pointer-events: none, so listen on window — same pattern as the
  // loading screen's rack hall.
  useEffect(() => {
    if (reducedMotion) return
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      }
      invalidate()
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [reducedMotion, invalidate])

  // Same spring-damper inertia as the loading screen's rack hall.
  const STIFFNESS = 24
  const DAMPING = 7
  const spin = useRef(0)
  useFrame(({ clock }, delta) => {
    if (!group.current) return
    if (!reducedMotion) spin.current += delta * 0.06
    const targetY = spin.current + (reducedMotion ? 0 : pointer.current.x * 0.09)
    const targetX = reducedMotion ? 0 : pointer.current.y * 0.03
    const step = Math.min(delta, 1 / 30)
    velocity.current.y += (targetY - group.current.rotation.y) * STIFFNESS * step
    velocity.current.y *= Math.max(0, 1 - DAMPING * step)
    group.current.rotation.y += velocity.current.y * step
    velocity.current.x += (targetX - group.current.rotation.x) * STIFFNESS * step
    velocity.current.x *= Math.max(0, 1 - DAMPING * step)
    group.current.rotation.x += velocity.current.x * step
    if (!reducedMotion) group.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 1.2
    const settled =
      reducedMotion &&
      Math.abs(velocity.current.x) < 0.0001 &&
      Math.abs(velocity.current.y) < 0.0001 &&
      Math.abs(targetX - group.current.rotation.x) < 0.0001 &&
      Math.abs(targetY - group.current.rotation.y) < 0.0001
    if (!settled) invalidate()
  })

  // Same camera distance as DataCentreScene (Who We Are), pulled in closer for a tighter frame.
  const narrow = size.width / size.height < 0.85
  return (
    <>
      <CameraRig
        position={narrow ? [66.5, 43.7, 94.5] : [53.2, 36, 73.5]}
        target={[0, 15, 0]}
        fov={37}
        far={500}
      />
      <color attach="background" args={['#040404']} />
      <hemisphereLight intensity={2.2} />
      <directionalLight position={[60, 80, 45]} intensity={3} />
      <group ref={group}>
        <DataCentre mode="textured" />
      </group>
    </>
  )
}
