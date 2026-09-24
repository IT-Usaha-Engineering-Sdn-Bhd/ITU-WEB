# Data centre

Reference-based exterior model with light-responsive PBR materials and a clean architectural outline mode.

| File | Purpose |
| --- | --- |
| `data-centre.glb` | Standalone glTF 2.0 binary, including all textures |
| `data-centre.blend` | Editable Blender source with packed textures and a separate preview rig |
| `data-centre-preview.png` | Static Blender preview; its ground and lights are not in the GLB |
| `data-centre-outline.png` | Static screenshot of the React Three Fiber outline view |
| `data-centre.stats.json` | Measured export statistics |
| `data-centre.browser-checks.json` | Actual headless Chrome WebGL/WebGPU integration results |

The GLB is **3,656,804 bytes (3.66 MB)** with **19,776 triangles**, **12 meshes**, and **8 materials**. Textures are embedded: 1024px foliage albedo, 512px foliage normal map, and a 256px screen pattern. No Draco, Meshopt, KTX2, external resources, or custom shaders are needed.

## Coordinates and fidelity

Y-up, front facing +Z, metres, origin at the ground-level building centre. The main structure is approximately 60m wide × 32m tall × 28m deep; cladding extends slightly beyond it. Scale is inferred from the supplied image, not surveyed. The roof and rear are inferred. Only the building is included; there is no interior, landscaping, road, or surrounding scene. Foliage is a textured surface with shallow relief, not individual modeled leaves.

## React Three Fiber

The reusable component is `src/three/DataCentre.tsx`. Render it inside a Canvas and Suspense boundary:

```tsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DataCentre } from '@/three/DataCentre'

export function BuildingScene() {
  return (
    <Canvas shadows camera={{ position: [76, 45, 105], fov: 37, far: 500 }}>
      <hemisphereLight intensity={2.5} />
      <directionalLight
        position={[60, 80, 45]} intensity={3.5} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-65} shadow-camera-right={65}
        shadow-camera-top={65} shadow-camera-bottom={-65}
        shadow-camera-near={1} shadow-camera-far={220}
        shadow-normalBias={0.08}
      />
      <Suspense fallback={null}>
        <DataCentre mode="textured" />
      </Suspense>
      <OrbitControls target={[0, 15, 0]} />
    </Canvas>
  )
}
```

Use `<DataCentre mode="outline" outlineColor="#d9efeb" />` for clean edges. The component also accepts normal R3F group transforms (`position`, `rotation`, `scale`) and an optional `url`. It works with demand rendering and invalidates the frame after a mode/color change.

Outline mode is runtime rendering supplied by the component, not a material switch embedded in glTF. Mesh extras `outline: false` identify fine foliage/rib/fin detail to omit. `EdgesGeometry` suppresses flat triangulation diagonals; a depth-only building surface hides obscured edges. Lines are thin, unlit, and do not cast shadows. Textured mode uses the original PBR materials and enables mesh shadow casting/receiving. The application must also enable renderer/light shadows and provide any ground receiving the building's shadow.

Cached GLB geometry, textures, and original materials remain shared. Each mounted component owns and disposes only its generated edge geometry and temporary display materials.

## Interactive example and WebGPU

From the repository root:

```sh
node scripts/preview-data-centre.mjs
```

Open `http://127.0.0.1:4175`. The local example supports orbit/zoom, textured/outline switching, moving the light, and hiding/remounting the model. It does not modify the website's existing scene. No CDN or network connection is required after dependencies are installed.

The WebGPU link uses `three/webgpu`'s `WebGPURenderer`, asynchronously initialized through Canvas's `gl` callback. The example initializes it with the DOM canvas rather than passing WebGL-only options. Three.js may fall back to WebGL2 where native WebGPU is unavailable. Both native WebGPU and WebGL were exercised during delivery; see the browser-check report for the actual backend used.

## Rebuild and verify

Use Blender 5.2 (or a compatible Blender with the glTF exporter):

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-data-centre.py
node scripts/validate-data-centre.mjs
node node_modules/esbuild/bin/esbuild scripts/data-centre-display.test.ts --bundle --platform=node --format=esm --packages=external --outfile=.cache/data-centre-tests.mjs
node --test .cache/data-centre-tests.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
```

With the preview server running, `node scripts/check-data-centre-browser.mjs` launches an isolated headless Chrome profile and checks both renderers, captures front/rear and changed-light screenshots, toggles display modes, and remounts the model to check resource counts. Override `CHROME_PATH` if Chrome is installed elsewhere. Results and screenshots go to `.cache/data-centre-browser/`.

The structural validator checks binary bounds, indices, finite vertex data, unit normals, embedded textures, material types, outline metadata, and the size/triangle budgets. It is a local validation script, not the Khronos conformance validator. Visual comparison and browser tests complement it.
