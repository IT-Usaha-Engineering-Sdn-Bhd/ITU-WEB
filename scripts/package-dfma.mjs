import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3 } from 'three'
const dir = path.resolve('public/models/dfma'),
  files = [],
  geometry = []
const data = JSON.parse(await readFile(path.join(dir, 'assembly-states.json'), 'utf8')),
  states = data.states
const groups = [
  'Module_Frame',
  'Module_Pipework',
  'Module_Cable_Containment',
  'Module_Distribution',
  'Module_Interfaces',
  'Transport_Preparation',
]
let ids, transforms, bounds
const snapshot = (o) => ({
  position: o.position.toArray(),
  quaternion: o.quaternion.toArray(),
  scale: o.scale.toArray(),
})
for (const mobile of [false, true]) {
  const file = mobile ? 'dfma-mobile.glb' : 'dfma.glb',
    bytes = await readFile(path.join(dir, file))
  const doc = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
  assert(doc.extensionsUsed.includes('EXT_meshopt_compression'))
  assert(!doc.extensionsUsed.includes('KHR_materials_unlit'))
  assert(bytes.length < (mobile ? 3 : 8) * 1e6)
  const { scene } = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const current = doc.nodes.map((n) => n.name).sort()
  if (mobile) assert.deepEqual(current, ids)
  else ids = current
  for (const group of groups) assert(scene.getObjectByName(group))
  const record = {}
  for (const [name, a] of Object.entries(data.assembledBlenderPositions)) {
    const o = scene.getObjectByName(name)
    assert(o, name)
    const base = snapshot(o),
      e = data.explodedBlenderPositions[name],
      delta = [e[0] - a[0], e[2] - a[2], -(e[1] - a[1])]
    record[name] = {
      assembled: base,
      exploded: { ...base, position: base.position.map((v, i) => v + delta[i]) },
    }
  }
  if (mobile) assert.deepEqual(record, transforms)
  else transforms = record
  function view(mode) {
    for (const [name, t] of Object.entries(record)) {
      const o = scene.getObjectByName(name),
        v = t[mode]
      o.position.fromArray(v.position)
      o.quaternion.fromArray(v.quaternion)
      o.scale.fromArray(v.scale)
    }
  }
  for (let n = 0; n < 3; n++) {
    view('exploded')
    for (const [name, t] of Object.entries(record))
      assert.deepEqual(snapshot(scene.getObjectByName(name)), t.exploded)
    view('assembled')
    for (const [name, t] of Object.entries(record))
      assert.deepEqual(snapshot(scene.getObjectByName(name)), t.assembled)
  }
  for (const state of Object.values(states)) {
    view(state.view)
    for (const group of groups)
      scene.getObjectByName(group).visible = state.visibleGroups.includes(group)
    for (const name of state.hiddenComponents ?? []) assert(scene.getObjectByName(name))
    for (const group of state.highlightGroups) assert(scene.getObjectByName(group))
  }
  view('assembled')
  scene.getObjectByName('Transport_Preparation').visible = false
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
  bounds = new Box3().setFromObject(scene)
  geometry.push({ variant: mobile ? 'mobile' : 'desktop', triangles, meshes })
  files.push({ file, bytes: bytes.length, compression: 'EXT_meshopt_compression' })
}
for (const key of Object.keys(states)) {
  const file = 'stage-' + key + '.webp'
  await sharp(path.join(dir, 'stage-' + key + '.png'))
    .webp({ quality: 83 })
    .toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
  states[key].poster = file
}
for (const [input, file] of [
  ['stage-installation.png', 'dfma-poster.webp'],
  ['dfma-mobile-render.png', 'dfma-mobile-poster.webp'],
  ['dfma-exploded-render.png', 'dfma-exploded-poster.webp'],
]) {
  await sharp(path.join(dir, input)).webp({ quality: 83 }).toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
}
for (const file of [
  'dfma.blend',
  'assembly-states.json',
  'dfma.README.md',
  ...Object.keys(states).map((k) => 'stage-' + k + '.png'),
  'dfma-mobile-render.png',
  'dfma-exploded-render.png',
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
await writeFile(
  path.join(dir, 'manifest.json'),
  JSON.stringify(
    {
      id: 'dfma',
      description:
        'Illustrative modular MEP assembly. No verified manufacturing, lifting, transport, capacity or certification claims.',
      files,
      geometry,
      groups,
      componentIds: ids,
      transforms,
      transformSpace:
        'glTF local transforms relative to named identity root groups; quaternions in xyzw order. Apply absolute values, never accumulate offsets.',
      states,
      defaultState: 'installation',
      initialization:
        'GLB includes all stage objects. Immediately apply installation visibility, hiding Transport_Preparation; restore per-component visibility before applying hiddenComponents for each stage.',
      stageEmphasis:
        'Optional neutral silver material emphasis for highlightGroups; store and restore original materials. Rendered stage differences use geometry/visibility and assembly spacing.',
      units: 'metres, illustrative proportions',
      origin: 'Frame centre/base datum [0,0,0]',
      coordinates: { blender: 'Z up, front -Y', gltf: 'Y up, front +Z' },
      boundsIncludingTransport: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      cameras: {
        desktop: {
          position: [10, 9, 13],
          target: [0, 1.5, 0],
          horizontalSpan: 12.8,
          verticalSpan: 9.6,
        },
        mobile: {
          position: [10, 9, 13],
          target: [0, 1.5, 0],
          verticalSpan: 12.8,
          horizontalSpan: 11.63636,
        },
      },
      materials: {
        type: 'Opaque metallic-roughness PBR, normals, no unlit shaders or baked lighting',
        textures: 0,
        textureCompression: 'KTX2 not applicable',
        shadows:
          'Enable renderer.shadowMap.enabled, keyLight.castShadow and mesh.castShadow/receiveShadow. Refit light shadow bounds for exploded view.',
      },
      source: {
        generator: 'Blender 5.2.2 LTS',
        materials: 'Appended from ../data-centre/data-centre.blend',
        geometry:
          'Original procedural model in scripts/build-dfma.py; no downloaded meshes or textures.',
        mobile: 'Simplifies flange bolts only, preserving IDs and interface positions.',
        preview: 'Separate Preview rig with ground, camera and lights excluded from exports.',
      },
      verification: [
        'Reopened Blender source.',
        'Both GLBs loaded through Three.js GLTFLoader and MeshoptDecoder.',
        'Exact assembled/exploded transforms match between desktop and mobile.',
        'Three exploded/assembled cycles verified without transform drift.',
        'Stage groups/components, lit materials, normals and budgets checked.',
        'Stage, exploded and mobile posters visually reviewed; browser GPU performance not benchmarked.',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(JSON.stringify({ files: files.slice(0, 9), geometry }, null, 2))
