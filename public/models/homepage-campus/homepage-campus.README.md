# Homepage campus

Illustrative exterior overview created in Blender for `docs/3d/02-homepage-campus.md`. It includes three building volumes, rooftop plant, facade bays, service entrances and sparse access context. It does not depict an identified company site or claim any capacity or certification.

## Deliverables

- `homepage-campus.blend`: editable source, named collections and separate Preview rig.
- `homepage-campus.glb`: Meshopt-compressed model with opaque PBR materials.
- `homepage-campus-poster.webp`: 1800 x 1000 static fallback, campus on the right and copy space on the left.
- `manifest.json`: exact sizes, geometry counts, source notes and camera configuration.
- `homepage-campus-lighting-check.png`: second illumination arrangement demonstrating material and shadow response.

## Lighting and integration

The model has no baked lighting, unlit shaders, textures or transparency. Its surfaces react to runtime lights and can cast and receive shadows. Configure Three.js shadow flags, which are not stored by glTF:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const { scene } = await loader.loadAsync('/models/homepage-campus/homepage-campus.glb')
scene.traverse(object => {
  if (object.isMesh) {
    object.castShadow = true
    object.receiveShadow = true
  }
})
renderer.shadowMap.enabled = true
keyLight.castShadow = true
```

Provide ambient/environment fill and fit the shadow camera to the 62 x 44 m campus. No KTX2 loader is needed. Studio ground, lights and camera remain in the Blender Preview collection and are excluded from the GLB.

Use the orthographic camera from the manifest for the wide hero framing. Coordinates are metres with glTF Y up and front +Z; the origin is the site centre. On narrow layouts, place the poster beside or below HTML content without cropping away the campus. This delivery does not alter the website scene registry or UI.

Stable roots: `Campus_Buildings`, `Campus_Site`, `Campus_Accents`. Service materials were reused directly; no service interiors were imported. All campus geometry is original procedural work in this repository, with no downloaded meshes or textures.

## Rebuild

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-homepage-campus.py
node scripts/package-homepage-campus.mjs
```

Requires the existing Data Centre Blender source for shared materials and installed `three` and `sharp` packages for packaging and loader verification.
