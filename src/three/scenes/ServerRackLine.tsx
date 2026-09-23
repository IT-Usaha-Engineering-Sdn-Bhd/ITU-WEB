'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Instance, Instances, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { CameraRig } from '@/three/CameraRig'

const URL = '/models/server/server-rack.glb'
const ROWS = 6
const COLS = 10
const SPACING = 1.4
const HALL_DEPTH = (ROWS - 1) * SPACING

export function ServerRackLine({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(URL)
  const group = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const { invalidate } = useThree()
  const { geometry, material } = useMemo(() => {
    let mesh: Mesh | undefined
    scene.traverse((object) => {
      if (object instanceof Mesh) mesh = object
    })
    if (!mesh) throw new Error('server-rack.glb has no mesh')
    return { geometry: mesh.geometry, material: mesh.material as MeshStandardMaterial }
  }, [scene])

  const positions = useMemo(
    () =>
      Array.from({ length: ROWS * COLS }, (_, i) => {
        const row = Math.floor(i / COLS)
        const col = i % COLS
        return [(col - (COLS - 1) / 2) * SPACING, 0, -row * SPACING] as const
      }),
    [],
  )
  const fixtureRows = useMemo(() => Array.from({ length: ROWS }, (_, row) => -row * SPACING), [])

  // The canvas itself is pointer-events: none (see .global-canvas), so a drag control like
  // PresentationControls would never receive input — listen on window instead and tilt the
  // hall toward the pointer, same pattern as DataCentreScene's parallax.
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
  // Spring-damper instead of a straight lerp: the hall has weight, so it accelerates toward
  // the pointer, eases past it slightly, and settles — actual inertia rather than a snap-to.
  const STIFFNESS = 24
  const DAMPING = 7
  useFrame((_, delta) => {
    if (!group.current) return
    const targetY = reducedMotion ? 0 : pointer.current.x * 0.09
    const targetX = reducedMotion ? 0 : pointer.current.y * 0.03
    const step = Math.min(delta, 1 / 30)
    velocity.current.y += (targetY - group.current.rotation.y) * STIFFNESS * step
    velocity.current.y *= Math.max(0, 1 - DAMPING * step)
    group.current.rotation.y += velocity.current.y * step
    velocity.current.x += (targetX - group.current.rotation.x) * STIFFNESS * step
    velocity.current.x *= Math.max(0, 1 - DAMPING * step)
    group.current.rotation.x += velocity.current.x * step
    const settled =
      Math.abs(velocity.current.x) < 0.0001 &&
      Math.abs(velocity.current.y) < 0.0001 &&
      Math.abs(targetX - group.current.rotation.x) < 0.0001 &&
      Math.abs(targetY - group.current.rotation.y) < 0.0001
    if (!settled) invalidate()
  })

  return (
    <group>
      <CameraRig position={[4.2, 3.1, 4.6]} target={[0, 1.2, -HALL_DEPTH / 2]} far={60} />
      {/* Dark factory floor, lit only from directly above — the loading-stage brief. */}
      <color attach="background" args={['#040404']} />
      <pointLight
        position={[0, 6, -HALL_DEPTH / 2]}
        intensity={140}
        distance={26}
        decay={2}
        color="#f3eee4"
      />
      {/* Key light — a directional light doesn't fall off with distance, so unlike the point
          light above it lights the whole hall evenly, not just the racks directly beneath it. */}
      <directionalLight position={[4, 5, 2]} intensity={4.5} color="#f3eee4" />
      <ambientLight intensity={0.3} />
      <group ref={group}>
        {fixtureRows.map((z) => (
          <group key={z}>
            <mesh position={[0, 4.8, z]}>
              <boxGeometry args={[COLS * SPACING + 1, 0.16, 0.18]} />
              <meshStandardMaterial color="#242422" roughness={0.8} />
            </mesh>
            <mesh position={[0, 4.68, z]}>
              <boxGeometry args={[COLS * SPACING - 1.5, 0.04, 0.1]} />
              <meshStandardMaterial color="#f3eee4" emissive="#f3eee4" emissiveIntensity={2} />
            </mesh>
          </group>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -HALL_DEPTH / 2]} receiveShadow>
          <planeGeometry args={[COLS * SPACING + 8, ROWS * SPACING + 8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        <Instances geometry={geometry} material={material} castShadow receiveShadow>
          {positions.map((position, i) => (
            <Instance key={i} position={position} />
          ))}
        </Instances>
      </group>
    </group>
  )
}

useGLTF.preload(URL)
