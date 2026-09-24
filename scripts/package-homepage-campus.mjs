import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3 } from 'three'
const dir = path.resolve('public/models/homepage-campus')
const bytes = await readFile(path.join(dir, 'homepage-campus.glb'))
const doc = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
assert(doc.extensionsUsed.includes('EXT_meshopt_compression'))
assert(!doc.extensionsUsed.includes('KHR_materials_unlit'))
assert(!doc.textures?.length)
assert(bytes.length <= 3000000)
const { scene } = await new GLTFLoader()
  .setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
const groups = ['Campus_Buildings', 'Campus_Site', 'Campus_Accents']
for (const group of groups) assert(scene.getObjectByName(group))
let triangles = 0,
  drawCalls = 0
scene.traverse((o) => {
  if (o.isMesh) {
    drawCalls++
    triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
    assert(o.material.isMeshStandardMaterial)
    assert(o.geometry.attributes.normal)
  }
})
await sharp(path.join(dir, 'homepage-campus-render.png'))
  .webp({ quality: 83 })
  .toFile(path.join(dir, 'homepage-campus-poster.webp'))
assert((await stat(path.join(dir, 'homepage-campus-poster.webp'))).size <= 250000)
const files = []
for (const file of [
  'homepage-campus.blend',
  'homepage-campus.glb',
  'homepage-campus-poster.webp',
  'homepage-campus-render.png',
  'homepage-campus-lighting-check.png',
  'homepage-campus.README.md',
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
const box = new Box3().setFromObject(scene)
const manifest = {
  id: 'homepage-campus',
  description:
    'Illustrative data centre campus overview, not a representation of a named or verified company site.',
  generator: 'Blender 5.2.2 LTS',
  files,
  geometry: { triangles, drawCalls, compression: 'EXT_meshopt_compression', textures: 0 },
  groups,
  components: doc.nodes.filter((n) => n.mesh !== undefined || n.children).map((n) => n.name),
  units: 'metres; conceptual dimensions, not surveyed',
  origin: 'Campus ground-plane centre [0,0,0]; foundation extends below ground',
  coordinates: { blender: 'Z up, front -Y', gltf: 'Y up, front +Z' },
  bounds: { min: box.min.toArray(), max: box.max.toArray() },
  camera: {
    projection: 'orthographic',
    position: [80, 86, 110],
    target: [0, 2, 0],
    horizontalSpan: 135,
    verticalSpan: 75,
    blenderShiftX: -0.19,
    threeOrthographic: { left: -93.15, right: 41.85, top: 37.5, bottom: -37.5 },
    poster: [1800, 1000],
    composition: 'Campus on right; left region reserved for HTML copy. No baked labels.',
  },
  materials: {
    model: 'Opaque metallic-roughness PBR',
    lighting:
      'No baked illumination; normal vectors and opaque surfaces support dynamic light and shadows.',
    runtime:
      'Enable renderer.shadowMap.enabled, light.castShadow and mesh.castShadow/receiveShadow. Fit shadow-camera bounds to campus. Preview studio lights are excluded from GLB.',
    textures: 'None; KTX2 not applicable.',
  },
  source: {
    service: '../data-centre/data-centre.blend',
    retained: 'Six actual service-family materials appended into this source.',
    rebuilt:
      'All campus geometry authored procedurally in scripts/build-homepage-campus.py. Inspected service shell is a 12.6 x 9.6 m interior cutaway; its walls and open roof do not fit this exterior overview. Original exterior is facade-specific and unnecessary for the lower-cost campus silhouette.',
    license:
      'Original geometry created for this repository; no third-party meshes or textures downloaded. Reused materials originate from the repository Data Centre scene; no external license asserted.',
    scale: 'Site footprint 62 x 44 m; primary hall 31 x 22 x 10 m. Illustrative proportions only.',
  },
  verification: {
    gltf: 'Reopened with Three.js GLTFLoader and bundled MeshoptDecoder; checked named groups, lit PBR materials, normals, triangles and transfer budgets.',
    blender: 'Saved source reopened independently to inspect collections and camera.',
    visual: 'Hero poster and changed-light render inspected; no browser performance benchmark.',
  },
}
await writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ files, triangles, drawCalls }, null, 2))
