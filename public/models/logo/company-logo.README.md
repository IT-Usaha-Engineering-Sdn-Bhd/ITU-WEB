# Company logo GLB

`company-logo.glb`: 33,064 bytes, 600 triangles, two meshes, two PBR materials, no textures or decoder dependencies. Centered origin; Y up; front faces +Z; height 2 units; depth approximately 0.119 units. White regions of the reference are empty space.

Materials: `LogoBlack` (`#060709`) and `LogoOrange` (`#ed8b20`), sampled from the JPEG. Both use roughness 0.4 and metalness 0. Emission is off in the asset.

## React Three Fiber example

Use in a client-only canvas (the project already provides that boundary through `Scene.tsx`). This example is optional; the existing website has not been modified.

```tsx
'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Mesh, MeshStandardMaterial } from 'three'

function Logo({ glow = 0 }: { glow?: number }) {
  const { scene } = useGLTF('/models/company-logo.glb')
  const instance = useMemo(() => {
    const copy = scene.clone(true)
    copy.traverse((object) => {
      if (!(object instanceof Mesh)) return
      object.castShadow = true
      object.receiveShadow = true
      // Clone materials so this instance does not change the useGLTF cache.
      object.material = (object.material as MeshStandardMaterial).clone()
    })
    return copy
  }, [scene])

  useEffect(() => {
    instance.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const material = object.material as MeshStandardMaterial
      if (material.name === 'LogoOrange') {
        material.emissive.copy(material.color)
        material.emissiveIntensity = glow
      }
    })
  }, [instance, glow])

  useEffect(() => () => {
    instance.traverse((object) => {
      if (object instanceof Mesh) (object.material as MeshStandardMaterial).dispose()
    })
  }, [instance])

  return <primitive object={instance} dispose={null} rotation={[0, -0.2, 0]} />
}

export function LogoPreview() {
  return (
    <div style={{ height: 500 }}>
      <Canvas shadows camera={{ position: [0, 0.2, 4], fov: 38 }}>
        <color attach="background" args={['#c4c7cc']} />
        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow position={[3, 4, 5]} intensity={3}
          shadow-mapSize={[1024, 1024]} shadow-normalBias={0.02}
          shadow-camera-left={-3} shadow-camera-right={3}
          shadow-camera-top={3} shadow-camera-bottom={-3}
        />
        <Suspense fallback={null}><Logo glow={2.5} /></Suspense>
        <mesh receiveShadow position={[0, 0, -0.3]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#c4c7cc" roughness={1} />
        </mesh>
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={1} luminanceSmoothing={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

Set `glow={0}` for the original non-emissive material. Raising it enables an orange glow through bloom; very high emission reduces visible lighting contrast. Bloom is a screen-space effect and does not illuminate nearby objects. Shadow flags, lights, receivers, and postprocessing belong to the consuming scene, not the GLB.

Regenerate and run structural checks with `node scripts/generate-logo.mjs` from the project root.
