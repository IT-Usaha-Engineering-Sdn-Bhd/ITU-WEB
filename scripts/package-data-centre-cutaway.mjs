import { readFile, writeFile, stat, readdir } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3 } from 'three'
const dir = path.resolve('public/models/data-centre')
const groups = ['Architecture', 'Power', 'Cooling', 'Protection', 'Controls']
const states = JSON.parse(await readFile(path.join(dir, 'layer-states.json'), 'utf8'))
const files = []
for (const mobile of [false, true]) {
  const name = mobile ? 'data-centre-mobile.glb' : 'data-centre.glb'
  const bytes = await readFile(path.join(dir, name))
  const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
  assert(json.extensionsUsed.includes('EXT_meshopt_compression'))
  assert(!json.extensionsUsed.includes('KHR_materials_unlit'))
  assert(bytes.length < (mobile ? 3 : 8) * 1e6)
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const gltf = await loader.parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  )
  for (const name of groups) assert(gltf.scene.getObjectByName(name), name)
  let triangles = 0,
    meshes = 0
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      meshes++
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
      assert(o.material.isMeshStandardMaterial)
      assert(o.geometry.attributes.normal)
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  const bounds = new Box3().setFromObject(gltf.scene)
  files.push({
    file: name,
    bytes: bytes.length,
    compression: 'EXT_meshopt_compression',
    triangles,
    meshes,
    bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
    verification:
      'Reopened with Three.js GLTFLoader and MeshoptDecoder; all system groups, PBR materials and normals present.',
  })
  const poster = mobile ? 'data-centre-mobile-poster.webp' : 'data-centre-poster.webp'
  await sharp(path.join(dir, mobile ? 'data-centre-mobile-render.png' : 'data-centre-render.png'))
    .webp({ quality: 82 })
    .toFile(path.join(dir, poster))
  const size = (await stat(path.join(dir, poster))).size
  assert(size <= 250000)
  files.push({ file: poster, bytes: size, compression: 'WebP quality 82' })
}
for (const system of Object.keys(states)) {
  const name = `layer-${system.toLowerCase()}.webp`
  await sharp(path.join(dir, `layer-${system.toLowerCase()}.png`))
    .webp({ quality: 80 })
    .toFile(path.join(dir, name))
  states[system].poster = name
}
for (const file of [
  'data-centre.blend',
  'data-centre-working.blend',
  'source-inspection.json',
  'layer-states.json',
  ...Object.keys(states).map((s) => `layer-${s.toLowerCase()}.webp`),
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
for (const file of await readdir(dir)) {
  if (file === 'manifest.json' || files.some((f) => f.file === file)) continue
  const info = await stat(path.join(dir, file))
  if (info.isFile())
    files.push({
      file,
      bytes: info.size,
      role: file.includes('raw')
        ? 'Uncompressed intermediate'
        : file.includes('outline') || file.includes('preview')
          ? 'Historical exterior preview'
          : 'Supporting source, render or documentation',
    })
}
const manifest = {
  id: 'data-centre',
  description:
    'Illustrative engineering cutaway; no measured capacities, certification or live status.',
  generator: 'Blender 5.2.2 LTS',
  files,
  units: 'metres',
  origin: 'Facility footprint centre at finished floor level; foundation extends below origin',
  coordinates: { blender: 'Z up, open front -Y', gltf: 'Y up, open front +Z' },
  groups,
  states,
  camera: {
    projection: 'orthographic',
    position: [13, 14, 18],
    target: [0, 1, -0.3],
    desktopVerticalSpan: 13.65,
    mobileVerticalSpan: 20.11,
  },
  lighting: {
    materials:
      'Opaque metallic-roughness PBR; no baked illumination, no textures, no unlit materials',
    runtime:
      'Enable renderer.shadowMap, castShadow on light, and castShadow/receiveShadow on meshes. GLB does not store Three.js shadow flags. Provide environment/fill lighting.',
    preview:
      'Source contains separate Preview collection with camera, floor and three area lights; excluded from GLBs.',
  },
  mobile:
    'Omits 168 fine vent bars; same system hierarchy, primary component names and camera origin.',
  textures: 'None; KTX2 not applicable.',
  sourceDecision: JSON.parse(await readFile(path.join(dir, 'source-inspection.json'), 'utf8'))
    .decision,
  notes: [
    'Original exterior assets preserved in originals/.',
    'Power, Cooling, Protection, Controls isolation retains Architecture context.',
    'Meshopt decoder required. Use the bundled Three.js decoder.',
    'Lightweight floor seams and vents are modeled geometry, allowing correct shadows.',
  ],
}
await writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify(files, null, 2))
