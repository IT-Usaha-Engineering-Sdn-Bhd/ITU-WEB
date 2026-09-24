# Data centre cutaway

Created in Blender 5.2 from `docs/3d/01-data-centre.md`. Illustrative equipment and routing, without capacity, certification or live-status claims.

| Asset | Size | Geometry |
| --- | --- | --- |
| `data-centre.glb` | 352,148 bytes | 10,908 triangles |
| `data-centre-mobile.glb` | 308,872 bytes | 8,892 triangles |
| `data-centre-poster.webp` | 61,076 bytes | 1400 x 1050 |
| `data-centre-mobile-poster.webp` | 39,188 bytes | 900 x 1000 |

`data-centre.blend` and `data-centre-working.blend` contain editable components and a separate studio rig. The original exterior source, export and README are preserved in `originals/`. The older preview/outline PNGs describe that original exterior; use the new WebP posters for this cutaway.

## Light and shadows

All surfaces use opaque metallic-roughness PBR materials with normals. There are no baked shadows, unlit shaders or texture dependencies. Geometry can cast and receive dynamic shadows. The Blender source includes a studio lighting rig; the GLBs exclude lights, camera and studio ground so the website controls lighting.

Three.js must enable shadows explicitly, since GLB does not carry its shadow flags:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const { scene } = await loader.loadAsync('/models/data-centre/data-centre.glb')
scene.traverse(object => {
  if (object.isMesh) {
    object.castShadow = true
    object.receiveShadow = true
  }
})
renderer.shadowMap.enabled = true
keyLight.castShadow = true
// Include ambient/environment fill. Fit the light's shadow camera to the model.
```

Both exports use EXT_meshopt_compression, so configure the decoder. No KTX2 is needed because there are no textures.

## Selectable systems

The roots `Architecture`, `Power`, `Cooling`, `Protection`, and `Controls` persist in both exports. Each Blender collection has a matching parent object so glTF preserves the hierarchy. Keep Architecture visible when isolating a system. `manifest.json` supplies component identifiers, file sizes, camera framing and layer visibility states. `layer-*.webp` files show isolated static states.

```js
for (const name of ['Power', 'Cooling', 'Protection', 'Controls']) {
  scene.getObjectByName(name).visible = selected === 'All' || selected === name
}
```

Coordinates are metres: Blender Z up / open front -Y; glTF Y up / open front +Z. Origin is the footprint centre near finished floor; the base extends to Y=-0.44. Bounds are approximately 12.6 x 3.98 x 9.6 metres in glTF. Use camera position [13,14,18], target [0,1,-0.3]. The previous exterior used a much larger scale; consumers should use the new framing in the manifest.

## Rebuild

Run from repository root:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-data-centre-cutaway.py
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python-exit-code 1 --python scripts/export-data-centre-cutaway.py
node scripts/package-data-centre-cutaway.mjs
```

`source-inspection.json` records the original retain/rebuild decision. Do not rerun the inspection script against the new source when reproducing that historical report.

Verification: reopened the saved Blender source, loaded both compressed GLBs with Three.js GLTFLoader/MeshoptDecoder, checked groups, materials, normals, triangles and size budgets. Visually reviewed desktop/mobile renders, all four isolated layers and a second lighting arrangement (`lighting-check.png`). Browser GPU performance and website integration are not part of this asset delivery.
