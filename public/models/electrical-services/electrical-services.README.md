# Electrical services

Illustrative distribution scene authored in Blender for `docs/3d/03-electrical-services.md`. Includes switchgear, transformer, generator, UPS/battery cabinets, low-voltage boards and outgoing feeder. It is a visual explanation, not an installation design, live status display or claim of electrical ratings/redundancy.

Editable source: `electrical-services.blend`. Optimized assets: `electrical-services.glb` and `electrical-services-mobile.glb`. Desktop, mobile and backup-state WebP posters are included. Exact sizes, component IDs, camera presets and state definitions are in `manifest.json`.

## Lighting and loading

Both GLBs use EXT_meshopt_compression. Configure `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)` using `three/addons/libs/meshopt_decoder.module.js`. All surfaces are opaque metallic-roughness PBR, with normals and no baked illumination. No textures or KTX2 loader are needed.

To enable dynamic shadows, set `renderer.shadowMap.enabled = true`, set `castShadow = true` on the key light, and traverse loaded meshes to set both `castShadow` and `receiveShadow` to true. Fit the shadow camera to the 18 x 10 m footprint. Provide fill/environment lighting. These Three.js flags are not stored in glTF.

The Blender Preview collection contains studio lighting and two camera presets. Preview objects are excluded from the GLBs.

## Supply states

Both exports default to normal supply. `supply-states.json` and the manifest contain exact highlighted/subdued path IDs. Equipment remains visible and stationary in both states. For each highlighted path, traverse its meshes and assign the loaded material named `Safety orange`; for subdued paths use `Graphite powdercoat`. Store material references before switching; the materials are shared, so assign them rather than changing their base colors globally. Dispose only any materials you explicitly clone.

Normal: switchgear → transformer → UPS → low-voltage distribution → outgoing feeder. Backup: generator → UPS → low-voltage distribution → outgoing feeder. The two separate UPS entry routes are schematic visual paths; transfer/protection engineering is not represented. The mobile asset keeps all equipment and route IDs and simplifies grille detail.

Coordinates use metres: Blender Z up, front -Y; glTF Y up, front +Z. All scale is illustrative. No website code is changed by this delivery.

## Rebuild

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-electrical-services.py
node scripts/package-electrical-services.mjs
```

The build appends shared materials from the existing Data Centre source and leaves that source unchanged. Packaging requires installed `three` and `sharp` dependencies.
