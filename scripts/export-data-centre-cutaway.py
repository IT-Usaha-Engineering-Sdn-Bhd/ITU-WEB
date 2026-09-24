import bpy, json
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'public/models/data-centre'
bpy.ops.wm.open_mainfile(filepath=str(OUT/'data-centre.blend'))
s=bpy.context.scene
for mobile,name in [(False,'data-centre.glb'),(True,'data-centre-mobile.glb')]:
    bpy.ops.object.select_all(action='DESELECT')
    for c in s.collection.children:
        if c.name=='Preview':continue
        for o in c.objects:
            if mobile and o.name.endswith('_FineVents'):continue
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
states={}
for system in ['Power','Cooling','Protection','Controls']:
    states[system]={'visibleGroups':['Architecture',system],'components':[o.name for o in bpy.data.collections[system].objects if o.type=='MESH']}
(OUT/'layer-states.json').write_text(json.dumps(states,indent=2))
s.render.resolution_x=900;s.render.resolution_y=675;s.cycles.samples=12
for system in states:
    for c in s.collection.children:c.hide_render=c.name not in ['Architecture','Preview',system]
    s.render.filepath=str(OUT/('layer-'+system.lower()+'.png'));bpy.ops.render.render(write_still=True)
for c in s.collection.children:c.hide_render=False
# Explicit second illumination state for comparison.
bpy.data.objects['Key'].location=(6,0,8)
bpy.data.lights['Key'].energy=3000
bpy.data.lights['Fill'].energy=100
bpy.data.lights['Rim'].energy=100
s.render.filepath=str(OUT/'lighting-check.png');bpy.ops.render.render(write_still=True)
print('EXPORT_AND_LAYERS_COMPLETE')
