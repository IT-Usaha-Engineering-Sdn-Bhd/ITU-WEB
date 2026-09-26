import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  Group,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  Texture,
  LinearFilter,
  LinearMipmapLinearFilter,
} from 'three'
import { sharpenTextures } from './textures.ts'

test('sampling handles material arrays/shared slots, clamps hardware limits, and is idempotent', () => {
  const texture = new Texture()
  texture.minFilter = LinearFilter
  const material = new MeshStandardMaterial({
    map: texture,
    normalMap: texture,
    aoMap: texture,
    roughnessMap: texture,
    metalnessMap: texture,
  })
  const root = new Group()
  root.add(new Mesh(new BoxGeometry(), [material, material]))
  const gl = { capabilities: { getMaxAnisotropy: () => 4 } }
  texture.addEventListener('dispose', () => assert.fail('shared texture disposed'))
  sharpenTextures(root, gl)
  assert.equal(texture.anisotropy, 4)
  assert.equal(texture.minFilter, LinearMipmapLinearFilter)
  assert.equal(texture.version, 1)
  sharpenTextures(root, gl)
  assert.equal(texture.version, 1)
  sharpenTextures(root, { capabilities: { getMaxAnisotropy: () => 16 } })
  assert.equal(texture.anisotropy, 8)
})

test('textures without mipmap generation keep compatible filtering; untextured meshes are safe', () => {
  const texture = new Texture()
  texture.generateMipmaps = false
  texture.minFilter = LinearFilter
  const root = new Group()
  root.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial({ map: texture })))
  root.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial()))
  sharpenTextures(root, { capabilities: { getMaxAnisotropy: () => 1 } })
  assert.equal(texture.minFilter, LinearFilter)
  assert.equal(texture.anisotropy, 1)
  assert.equal(texture.version, 0)
})
