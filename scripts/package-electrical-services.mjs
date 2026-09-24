import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3 } from 'three'
const dir = path.resolve('public/models/electrical-services'),
  files = [],
  counts = []
const groups = [
  'Architecture',
  'Primary_Supply',
  'Backup_Supply',
  'UPS',
  'Low_Voltage_Distribution',
  'Outgoing_Supply',
]
const states = JSON.parse(await readFile(path.join(dir, 'supply-states.json'), 'utf8'))
let desktopNames, bounds
for (const mobile of [false, true]) {
  const name = mobile ? 'electrical-services-mobile.glb' : 'electrical-services.glb',
    bytes = await readFile(path.join(dir, name))
  const doc = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
  assert(doc.extensionsUsed.includes('EXT_meshopt_compression'))
  assert(!doc.extensionsUsed.includes('KHR_materials_unlit'))
  assert(bytes.length < (mobile ? 3 : 8) * 1e6)
  const { scene } = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  for (const group of groups) assert(scene.getObjectByName(group))
  let triangles = 0,
    meshes = 0
  scene.traverse((o) => {
    if (o.isMesh) {
      meshes++
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
      assert(o.material.isMeshStandardMaterial)
      assert(o.geometry.attributes.normal)
    }
  })
  const ids = doc.nodes.map((n) => n.name).sort()
  if (mobile) assert.deepEqual(ids, desktopNames)
  else desktopNames = ids
  for (const state of Object.values(states))
    for (const id of [...state.highlighted, ...state.subdued]) assert(scene.getObjectByName(id), id)
  const materials = new Map()
  scene.traverse((o) => {
    if (o.isMesh) materials.set(o.material.name, o.material)
  })
  for (const state of Object.values(states)) {
    for (const id of state.highlighted)
      scene.getObjectByName(id).traverse((o) => {
        if (o.isMesh) o.material = materials.get('Safety orange')
      })
    for (const id of state.subdued)
      scene.getObjectByName(id).traverse((o) => {
        if (o.isMesh) o.material = materials.get('Graphite powdercoat')
      })
    for (const id of state.highlighted)
      scene.getObjectByName(id).traverse((o) => {
        if (o.isMesh) assert.equal(o.material.name, 'Safety orange')
      })
  }
  bounds = new Box3().setFromObject(scene)
  counts.push({ variant: mobile ? 'mobile' : 'desktop', triangles, meshes })
  files.push({ file: name, bytes: bytes.length, compression: 'EXT_meshopt_compression' })
}
for (const [input, output] of [
  ['electrical-services-render.png', 'electrical-services-poster.webp'],
  ['electrical-services-mobile-render.png', 'electrical-services-mobile-poster.webp'],
  ['electrical-services-backup-render.png', 'electrical-services-backup-poster.webp'],
]) {
  await sharp(path.join(dir, input)).webp({ quality: 83 }).toFile(path.join(dir, output))
  const bytes = (await stat(path.join(dir, output))).size
  assert(bytes <= 250000)
  files.push({ file: output, bytes, compression: 'WebP' })
}
for (const file of [
  'electrical-services.blend',
  'supply-states.json',
  'electrical-services.README.md',
  'electrical-services-render.png',
  'electrical-services-mobile-render.png',
  'electrical-services-backup-render.png',
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
const manifest = {
  id: 'electrical-services',
  description:
    'Illustrative distribution arrangement, not a wiring diagram or verified installation. No ratings, redundancy or live operating status implied.',
  files,
  geometry: counts,
  groups,
  componentIds: desktopNames,
  states,
  stateBehavior:
    'All equipment stays visible and stationary. Set highlighted route materials to Safety orange and subdued route materials to Graphite powdercoat. Default export is normal supply.',
  units: 'metres, illustrative scale',
  origin: 'Footprint centre at floor height; foundation extends below zero',
  coordinates: { blender: 'Z up, front -Y', gltf: 'Y up, front +Z' },
  bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
  cameras: {
    hero: {
      position: [12, 16, 19],
      target: [0, 1, 0],
      horizontalSpan: 23,
      verticalSpan: 15.333333,
    },
    powerPath: { position: [0, 22, 12], target: [0, 0.5, 0], horizontalSpan: 22 },
    mobile: {
      position: [12, 16, 19],
      target: [0, 1, 0],
      verticalSpan: 24,
      horizontalSpan: 21.81818,
    },
  },
  materials: {
    type: 'Opaque metallic-roughness PBR',
    textures: 0,
    compression: 'No textures; KTX2 not applicable',
    shadows:
      'Dynamic lighting and shadow-ready normals/geometry. Enable Three.js renderer shadows, light.castShadow and mesh.castShadow/receiveShadow. No baked lighting or unlit materials.',
  },
  source: {
    generator: 'Blender 5.2.2 LTS',
    materials: 'Appended from ../data-centre/data-centre.blend',
    geometry:
      'Original procedural geometry in scripts/build-electrical-services.py; no downloaded meshes or textures.',
    mobile: 'Simplified generator grille; identical node IDs, positions and state membership.',
    preview:
      'Separate Preview collection with studio ground, camera presets and lights; excluded from GLBs.',
  },
  verification: [
    'Reopened Blender source.',
    'Both GLBs parsed with Three.js GLTFLoader and MeshoptDecoder.',
    'Verified identical node names and both material-switch states.',
    'Checked PBR materials, normals, triangle counts and transfer budgets.',
    'Visually reviewed normal, backup and mobile renders. Browser performance not benchmarked.',
  ],
}
await writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ files: files.slice(0, 5), geometry: counts }, null, 2))
