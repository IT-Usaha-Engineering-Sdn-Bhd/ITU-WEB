'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Instance, Instances, useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { CameraRig } from '@/three/CameraRig'
import { modelRegistry } from '@/three/model-registry'
import { usePointerTilt } from '../usePointerTilt'
import { SceneFloat } from '../SceneFloat'
import { sharpenTextures } from '../textures'

const URL = modelRegistry['server-rack'].url
const ROWS = 6
const COLS = 10
const SPACING = 1.4
const HALL_DEPTH = (ROWS - 1) * SPACING

export function ServerRackLine({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(URL)
  const group = useRef<Group>(null)
  usePointerTilt(group, reducedMotion)
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    sharpenTextures(scene, gl)
  }, [scene, gl])
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
        <SceneFloat reducedMotion={reducedMotion} radius={5}>
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
          <Instances
            geometry={geometry}
            material={material}
            dispose={null}
            castShadow
            receiveShadow
          >
            {positions.map((position, i) => (
              <Instance key={i} position={position} />
            ))}
          </Instances>
        </SceneFloat>
      </group>
    </group>
  )
}
