import bpy, json, struct
from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'public/models/data-centre'
bpy.ops.wm.open_mainfile(filepath=str(p / 'data-centre.blend'))
raw = (p / 'data-centre.glb').read_bytes()
length = struct.unpack_from('<I', raw, 12)[0]
g = json.loads(raw[20:20+length])
report = {'blenderVersion': bpy.app.version_string, 'sourceObjects': [{'name':o.name,'type':o.type,'dimensions':list(o.dimensions),'vertices':len(o.data.vertices) if o.type=='MESH' else 0} for o in bpy.context.scene.objects], 'sourceCollections':[c.name for c in bpy.data.collections], 'glb':{'bytes':len(raw),'meshes':len(g.get('meshes',[])),'nodes':[n.get('name') for n in g.get('nodes',[])],'materials':len(g.get('materials',[]))},'decision':'Preserve original exterior in originals/. Rebuild interior cutaway: exterior is approximately 60 x 28 x 32 m, grouped by facade material, with foliage and closed roof unsuitable for system isolation. Retain graphite/metal/neutral palette concept; rebuild geometry and materials at illustrative room scale.'}
(p / 'source-inspection.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
