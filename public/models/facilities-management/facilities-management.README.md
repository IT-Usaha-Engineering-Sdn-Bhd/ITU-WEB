# Facilities management plant

Illustrative plant authored in Blender for `docs/3d/05-facilities-management.md`. Contains cooling units and valves, electrical panels, physical monitoring devices, a floor access cover, circulation space and a maintenance cart. No state represents actual readings, alarms, faults or verified service capability.

## Delivery

`facilities-management.blend` is editable and includes the `Maintenance states` text block, named collections, label anchors and preview cameras. Desktop/mobile GLBs share component IDs and transforms. The two `facilities-management-*-poster.webp` / `facilities-management-poster.webp` files show neutral views; `state-*.webp` provides neutral and discipline previews. Exact sizes, IDs, anchors and camera framing are in `manifest.json`.

## Highlight controls

Load with Three.js GLTFLoader and `setMeshoptDecoder(MeshoptDecoder)` from `three/addons/libs/meshopt_decoder.module.js`. Save original material references for all meshes before selection. Restore them on every state change, then traverse each ID in the selected state's `highlighted` array and assign a separate orange MeshStandardMaterial to its meshes. Do not modify shared material colors globally. Clearing selection restores the saved originals; no equipment is hidden or moved.

Use linear RGB `[0.85, 0.19, 0.035]`, metalness `0.25`, roughness `0.4`, with no emission for the highlight material. Create this material at runtime; neutral exports intentionally have no orange surfaces. Dispose your highlight material when the scene unmounts, while respecting cached geometry/material ownership.

The four `Anchor_*` empty objects support HTML responsibility labels. Their glTF world positions and suggested explanatory labels are listed in the manifest. Selection indicates an inspection area, never an alarm or operating condition.

## Lighting and shadows

Opaque metallic-roughness PBR surfaces and normal vectors support dynamic lights and shadows. There are no baked lighting maps, textures or unlit shaders. No KTX2 loader is needed.

Enable `renderer.shadowMap.enabled`, key-light `castShadow`, and mesh `castShadow` plus `receiveShadow`. These Three.js flags are not stored in GLB. Fit the shadow camera to the 13 x 10 m footprint and provide ambient/environment fill. Blender Preview lights, cameras and studio ground are excluded from exports.

Coordinates are metres: Blender Z up/front -Y, glTF Y up/front +Z. The origin is the site centre; all dimensions, routes and clearances are illustrative. Website integration is not changed by this asset delivery.

## Rebuild

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-facilities-management.py
node scripts/package-facilities-management.mjs
```

The build appends shared materials without modifying the Data Centre source. Packaging requires installed `three` and `sharp` packages.
