# DFMA modular MEP assembly

Illustrative module created in Blender for `docs/3d/06-dfma.md`: structural frame, two pipe circuits with valves/flanges, cable ladder, feeder, distribution panel and named interfaces. No manufacturing, installation, lifting or transport method is certified or claimed.

## Delivery and states

`dfma.blend` is editable and includes the embedded `Assembly states` text. `dfma.glb` and `dfma-mobile.glb` preserve the same IDs and interface locations. `dfma-poster.webp`, `dfma-mobile-poster.webp`, `dfma-exploded-poster.webp` and `stage-*.webp` provide static fallbacks. The manifest records exact sizes, transforms, stages and camera framing.

Initialize the loaded model with the installation state: show the five `Module_*` roots and hide `Transport_Preparation`. glTF does not preserve Blender render visibility; all stage geometry is included for later selection.

- Design: frame and datum anchors; interface meshes hidden.
- Fabrication: exploded frame/service/interface relationship.
- Transport: assembled module, protective caps and support blocks; no vehicle or lifting method.
- Installation: assembled module, caps/supports hidden and connection interfaces exposed.

For each change, first restore component visibility, then apply `visibleGroups` and `hiddenComponents`. Apply every component's absolute local position, quaternion and scale from the manifest's `transforms[ID].assembled` or `.exploded`. Never add repeated offsets. Stage emphasis may use a neutral silver material on `highlightGroups`; restore original materials when cleared. Geometry changes already distinguish the supplied static stage views.

The Blender state file contains authoring coordinates; the manifest contains runtime glTF transforms. Anchor and datum empties remain available for HTML label bindings. Transport parts are optional stage context, not installation hardware.

## Lighting and loading

Use `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)` from `three/addons/libs/meshopt_decoder.module.js`. Opaque PBR surfaces have normals and respond to dynamic lights. There are no textures, baked shadows or unlit materials; KTX2 is unnecessary.

Enable `renderer.shadowMap.enabled`, key-light `castShadow`, and `castShadow`/`receiveShadow` on every loaded mesh. These Three.js flags are not stored in GLB. Fit shadow-camera bounds to the exploded view as well as the assembled view and provide fill/environment light. Preview ground and lights are Blender-only.

Units are metres with illustrative proportions. Origin is the frame base centre. Blender uses Z up/front -Y; glTF uses Y up/front +Z. Mobile simplifies flange bolts while retaining all component IDs and transforms. Website UI is not changed by this asset delivery.

## Rebuild

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-dfma.py
node scripts/package-dfma.mjs
```

Shared materials are appended from the Data Centre source without changing it. Packaging uses installed `three` and `sharp` dependencies.
