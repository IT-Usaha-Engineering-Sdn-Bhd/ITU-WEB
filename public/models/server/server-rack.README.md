# Metallic server cabinet

`server-rack.glb` is a single static cabinet based on `server.jpg`. The unseen rear and depth are approximations. The GLB is self-contained and has no external files, custom shaders, required extensions, or compression decoder requirements.

| Property | Value |
| --- | --- |
| File size | 218,160 bytes / 213.0 KiB |
| Triangles | 944 |
| Meshes / material slots | 1 / 1 |
| Embedded textures | Three 1024 × 1024 PNG atlases |
| Textures | Base color, normal, packed occlusion/roughness/metalness |
| Approximate texture GPU memory | 16 MiB including mipmaps; shared across instances |
| Dimensions | 0.6 m wide × 2.2 m high × 1.1 m deep |
| Origin / axes | Bottom center; +Y up; +Z front |
| Mesh / material names | `ServerRack` / `ServerRackMaterial` |

## View

Open `server-rack-preview.html` for a self-contained orbitable preview with single-cabinet and 100-cabinet modes, front/rear views, a WebGL/WebGPU selector, and a GLB download button. The preview bundles its runtime and model, so it needs no CDN or external textures. WebGPU requires browser support and a secure context such as localhost; the preview reports fallback when applicable.

If a browser restricts local HTML execution, run from the repository root:

```sh
node scripts/serve-server-rack-preview.mjs
```

Then visit `http://127.0.0.1:4178`. This server exposes only the preview and GLB. Browser verification metrics, when available, are saved to `server-rack.browser-checks.json`.

Static visual checks are available as `server-rack-front.png`, `server-rack-angled.png`, and `server-rack-rear.png`. Their studio floor, camera, and lighting are not embedded in the GLB.

## React Three Fiber

Load with `useGLTF('/models/server-rack.glb')` or Three.js `GLTFLoader`. Use the reusable `ServerRacks` component in `examples/ServerRacks.tsx` to render a batch inside an existing R3F `<Canvas>`:

```tsx
import { ServerRacks } from './examples/ServerRacks'

const positions = Array.from({ length: 100 }, (_, i) =>
  [(i % 10) * 0.75, 0, Math.floor(i / 10) * 1.35] as const,
)

// Inside a Canvas with your existing camera and environment lighting:
<ServerRacks positions={positions} />
```

Keep the positions array stable unless the layout changes. The component updates instance matrices and bounds when positions change. It shares the GLTF cache's geometry, material, and textures, and leaves their disposal to the cache owner. The exported node has identity transforms, so its geometry can be instanced directly.

One InstancedMesh batch is designed for one rack draw call per render pass. Shadow passes, postprocessing, and other scene objects add calls. A hundred cabinets represent 94,400 triangles but still share the same asset resources. FPS is device- and scene-dependent.

Use an environment/reflection map and studio or area-style lighting to show the metallic finish. Dark metal can look nearly black without reflected light. The material uses standard glTF metallic-roughness PBR, which Three.js supports with WebGLRenderer and WebGPURenderer; renderer initialization is owned by the application, not the asset. No application renderer or homepage is changed by this delivery.

## Reproduce and verify

```sh
node scripts/generate-server-rack.mjs
node scripts/verify-server-rack.mjs
node scripts/build-server-rack-preview.mjs
```

The generator verifies the written GLB's structure, finite geometry, unit normals, triangle areas, bounds, embedded image sizes, and asset budgets. The separate verification script reloads the actual GLB with Three.js, decodes its images, checks material color spaces and metallic values, and verifies 100 shared-resource instances and bounds.

Optional visual QA, using an installed Blender executable:

```sh
blender --background --python scripts/render-server-rack.py
```

### Validation performed

- Passed GLB structure, geometry, texture, dimensions, triangle-count, and file-size checks.
- Passed Three.js GLTFLoader reload and embedded PNG decoding.
- Passed 100-instance shared-geometry/material and bounds checks.
- Imported and rendered successfully in Blender 5.2.2; inspected front, angled, and rear images.
- Passed targeted ESLint checks and repository TypeScript checking (`tsc --noEmit --incremental false`).
- Browser GPU rendering, measured draw calls, and native WebGPU execution were **not verified**: browser automation was unavailable in this session. The preview includes those checks for execution in a supported browser.
