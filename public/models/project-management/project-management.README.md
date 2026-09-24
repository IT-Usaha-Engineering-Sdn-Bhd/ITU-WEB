# Project management construction scene

Illustrative construction progression built in Blender for `docs/3d/04-project-management.md`. The fixed footprint contains a structural frame, rack equipment, cooling equipment, distribution board, coordinated overhead routes, and commissioning inspection/access details. It does not depict an actual project or verified schedule, performance or certification.

## Files

- `project-management.blend`: editable source with four named stage collections and a separate Preview rig. The embedded `Stage states` text contains visibility/anchor definitions.
- `project-management.glb` and `project-management-mobile.glb`: Meshopt-compressed exports, defaulting to the completed stage.
- `project-management-poster.webp` and `project-management-mobile-poster.webp`: completed-stage fallbacks.
- `stage-*.webp`: four static stage views with identical camera framing.
- `manifest.json`: sizes, IDs, anchors, stage membership, camera presets and source notes.

## Stage controls

Use the cumulative `visibleGroups` lists in `manifest.json` or `stage-states.json`. Set each corresponding loaded group object's `visible` property. Stage_Structure remains visible throughout; Stage_Equipment, Stage_Coordination and Stage_Commissioning are added in order. Equipment never moves.

The four `Anchor_*` empty objects persist in both GLBs. Anchor positions in the manifest are glTF coordinates and their responsibility text is intended for HTML labels. Gate label visibility with the selected stage. No interface text or live-looking measurements are baked into the model.

## Light and shadows

Configure `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)` using `three/addons/libs/meshopt_decoder.module.js`. There are no textures or KTX2 dependencies. All materials use opaque metallic-roughness PBR and respond to runtime lighting; geometry can cast and receive dynamic shadows.

Enable `renderer.shadowMap.enabled`, `castShadow` on the key light, and both `castShadow` and `receiveShadow` on each loaded mesh. These Three.js flags are not stored in GLB. Fit the light's shadow camera to the 15 x 11 m footprint and provide fill/environment lighting. Preview lights and studio ground exist only in the Blender source.

Coordinates are metres: Blender Z up/front -Y; glTF Y up/front +Z. The origin is the footprint centre. Dimensions and routing are illustrative. Mobile simplifies grille geometry while preserving names, placement and every stage. No website UI is changed by this asset delivery.

## Rebuild

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-project-management.py
node scripts/package-project-management.mjs
```

Shared materials are appended from the Data Centre Blender source without modifying it. Packaging requires installed `three` and `sharp` dependencies.
