'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Group } from 'three'
import { DataCentre } from '@/three/DataCentre'
import { CameraRig } from '@/three/CameraRig'

export function DataCentreScene({ reducedMotion }: { reducedMotion: boolean }) {
  const { size, invalidate } = useThree()
  const group = useRef<Group>(null)
  const narrow = size.width / size.height < .85
  // A gentle idle bob. This canvas runs frameloop="demand", so a perpetual animation has to
  // keep invalidating itself every frame — the same self-sustaining pattern OrbitControls'
  // own damping already relies on below.
  useFrame(({ clock }) => {
    if (reducedMotion) return
    if (group.current) group.current.position.y = Math.sin(clock.elapsedTime * .6) * 1.5
    invalidate()
  })
  return <>
    <CameraRig position={narrow ? [95, 56, 135] : [76, 45, 105]} target={[0, 15, 0]} fov={37} far={500} />
    <hemisphereLight intensity={2.2} /><directionalLight position={[60, 80, 45]} intensity={3} />
    <group ref={group}><DataCentre mode="outline" outlineColor="#eb8c24" /></group>
    {/* Zoom/pan stay off — this canvas sits mid-page inside a small box, and a wheel-zoom
        would fight the page's own wheel-driven scroll-snap whenever the cursor is over it.
        autoRotate is a built-in OrbitControls feature — it pauses while dragging and resumes
        after, no extra invalidate() plumbing needed beyond what damping already requires. */}
    <OrbitControls target={[0, 15, 0]} enableDamping dampingFactor={0.08} enableZoom={false} enablePan={false}
      autoRotate={!reducedMotion} autoRotateSpeed={0.25} />
  </>
}
