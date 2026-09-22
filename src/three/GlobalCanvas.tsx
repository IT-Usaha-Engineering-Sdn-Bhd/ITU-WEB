'use client'

import { Canvas } from '@react-three/fiber'

export function GlobalCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <mesh rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#eb8c24" />
        </mesh>
      </Canvas>
    </div>
  )
}
