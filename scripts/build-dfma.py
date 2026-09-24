"""Self-contained illustrative distribution asset, Blender 5.2."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/models/dfma';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
with bpy.data.libraries.load(str(ROOT/'public/models/data-centre/data-centre.blend'),link=False) as (a,b):
    b.materials=['Warm mineral shell','Graphite powdercoat','Brushed aluminium','Safety orange','Inactive instrument glass','Vent recess','Raised floor porcelain']
shell,dark,metal,orange,glass,black,floor=b.materials
names=['Module_Frame','Module_Pipework','Module_Cable_Containment','Module_Distribution','Module_Interfaces','Transport_Preparation','Preview'];groups={}
for name in names:
    c=bpy.data.collections.new(name);s.collection.children.link(c);root=bpy.data.objects.new(name,None);c.objects.link(root);groups[name]=(c,root)
def attach(o,name,group,mat):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    groups[group][0].objects.link(o);o.parent=groups[group][1];o.data.materials.append(mat);o['illustrative']=True
    return o
def box(name,p,d,mat,group='Module_Frame',bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);attach(o,name,group,mat)
    if bevel:
        m=o.modifiers.new('Edge radius','BEVEL');m.width=bevel;m.segments=2;bpy.ops.object.modifier_apply(modifier=m.name)
    return o
def cyl(name,a,b,r,mat,group,n=12):
    a,b=Vector(a),Vector(b);v=b-a;bpy.ops.mesh.primitive_cylinder_add(vertices=n,radius=r,depth=v.length,location=(a+b)/2);o=bpy.context.object;o.rotation_euler=v.to_track_quat('Z','Y').to_euler();return attach(o,name,group,mat)
def join(parts,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();parts[0].name=name;return parts[0]

frame,pipes,tray,dist,interfaces,transport=names[:6]
# Module datum at frame centre/base. No solid floor obscures services.
parts=[]
for y in [-1.25,1.25]:parts.append(box('Base rail',(0,y,.16),(6.6,.14,.22),metal))
for x in [-3.2,0,3.2]:parts.append(box('Cross rail',(x,0,.16),(.14,2.6,.22),metal))
join(parts,'Frame_Base_01')
for i,x in enumerate([-3.2,3.2]):
    parts=[]
    for y in [-1.25,1.25]:
        parts.append(box('Post',(x,y,1.6),(.14,.14,3),metal));parts.append(box('Foot',(x,y,.035),(.38,.38,.07),dark))
    parts.append(box('End header',(x,0,3.1),(.14,2.65,.16),metal))
    join(parts,f'Frame_EndPortal_{i+1:02d}')
for i,y in enumerate([-1.25,1.25]):box(f'Frame_TopRail_{i+1:02d}',(0,y,3.1),(6.5,.14,.16),metal)
for i,x in enumerate([-2,0,2]):box(f'Frame_ServiceCrossmember_{i+1:02d}',(x,0,2.8),(.1,2.6,.1),metal)
# Two distinct service circuits, recognizable flanged connection ends.
fine=[]
for i,y in enumerate([-.45,.45],1):
    parts=[cyl('Pipe run',(-3.22,y,1.75),(3.22,y,1.75),.15,dark,pipes,20)]
    for x in [-2.1,0,2.1]:
        parts.append(cyl('Pipe collar',(x-.06,y,1.75),(x+.06,y,1.75),.19,metal,pipes,16))
        parts.append(cyl('Hanger',(x,y,1.94),(x,y,2.75),.02,metal,pipes))
    join(parts,f'Pipe_Circuit_{i:02d}')
    parts=[cyl('Valve barrel',(.7,y,1.75),(1.15,y,1.75),.22,metal,pipes,16),cyl('Stem',(.92,y,1.85),(.92,y,2.18),.04,metal,pipes),cyl('Valve wheel',(.92,y,2.17),(.92,y,2.21),.21,orange,pipes,16)]
    join(parts,f'Pipe_IsolationValve_{i:02d}')
    for end,x in [('Inlet',-3.38),('Outlet',3.38)]:
        parts=[cyl('Flange',(x-.075,y,1.75),(x+.075,y,1.75),.26,metal,interfaces,20),cyl('Bore',(x-.081,y,1.75),(x+.081,y,1.75),.135,black,interfaces,20)]
        join(parts,f'Interface_{end}_{i:02d}')
        bolts=[]
        for j in range(8):
            a=j*math.tau/8;bolts.append(cyl('Bolt',(x-.095,y+.21*math.cos(a),1.75+.21*math.sin(a)),(x+.095,y+.21*math.cos(a),1.75+.21*math.sin(a)),.027,dark,interfaces,6))
        fine.append(join(bolts,f'Interface_{end}Bolts_{i:02d}'))
        cyl(f'Transport_{end}Cap_{i:02d}',(x+(-.12 if x<0 else .12),y,1.75),(x+(-.18 if x<0 else .18),y,1.75),.27,shell,transport,16)
# Cable ladder and distinct contained feeder, above pipework.
parts=[]
for y in [-.38,.38]:parts.append(box('Tray side',(0,y,2.58),(6.3,.05,.18),metal,tray))
for j in range(25):parts.append(box('Rung',(-3+j*.25,0,2.51),(.04,.8,.04),metal,tray))
join(parts,'Cable_LadderTray_01')
join([box('Cable bundle',(0,0,2.59),(6.3,.26,.09),dark,tray),box('End connector',(3.25,0,2.59),(.2,.4,.2),metal,tray)],'Cable_FeederBundle_01')
box('Interface_CableEntry_01',(-3.3,0,2.59),(.15,.48,.24),orange,interfaces)
# Front mounted distribution enclosure and connected feeder.
parts=[box('Enclosure',(1.95,-1.13,.96),(1.25,.42,1.3),dark,dist,.025),box('Door',(1.95,-1.36,.96),(1.1,.03,1.15),metal,dist),box('Handle',(2.35,-1.39,.95),(.025,.035,.2),black,dist)]
join(parts,'Distribution_Panel_01')
join([cyl('Vertical feeder',(1.95,-1.05,1.6),(1.95,-1.05,2.58),.035,dark,dist),cyl('Feeder return',(1.95,-1.05,2.58),(1.95,-.15,2.58),.035,dark,dist)],'Distribution_Feeder_01')
box('Interface_DistributionOutlet_01',(1.95,-1.38,.56),(.34,.09,.18),orange,interfaces)
for i,x in enumerate([-2.4,2.4],1):box(f'Transport_SupportBlock_{i:02d}',(x,0,-.18),(.5,3,.3),shell,transport, .035)
# Stable anchor empties survive export, inherited transforms remain predictable.
for name,loc in [('Datum_Base',(0,0,0)),('Anchor_PipeConnection',(3.38,.45,1.75)),('Anchor_CableConnection',(-3.3,0,2.59)),('Anchor_Distribution',(1.95,-1.4,.96))]:
    o=bpy.data.objects.new(name,None);groups[interfaces][0].objects.link(o);o.parent=groups[interfaces][1];o.location=loc;o['illustrative']=True
offsets={frame:(0,0,0),pipes:(0,.95,.5),tray:(0,0,1.5),dist:(0,-1.4,0),interfaces:(0,0,0),transport:(0,0,0)}
assembled={};exploded={}
for g,(c,r) in groups.items():
    if g=='Preview':continue
    for o in c.objects:
        if o==r:continue
        assembled[o.name]=list(o.location);offset=Vector(offsets[g])
        if g==interfaces:
            if 'Inlet' in o.name:offset=Vector((-1.1,.95,.5))
            elif 'Outlet' in o.name and 'Distribution' not in o.name:offset=Vector((1.1,.95,.5))
            elif 'Cable' in o.name:offset=Vector((-.5,0,1.5))
            elif 'Distribution' in o.name:offset=Vector((0,-1.4,0))
            elif 'PipeConnection' in o.name:offset=Vector((1.1,.95,.5))
        exploded[o.name]=list(o.location+offset)
states={'design':{'visibleGroups':[frame,interfaces],'view':'assembled','highlightGroups':[frame]},'fabrication':{'visibleGroups':names[:5],'view':'exploded','highlightGroups':[pipes,tray]},'transport':{'visibleGroups':names[:6],'view':'assembled','highlightGroups':[transport]},'installation':{'visibleGroups':names[:5],'view':'assembled','highlightGroups':[interfaces]}}
# Design uses only datum anchors from interface group; export explicit component visibility.
states['design']['hiddenComponents']=[o.name for o in groups[interfaces][0].objects if o.type=='MESH']
payload={'states':states,'assembledBlenderPositions':assembled,'explodedBlenderPositions':exploded,'highlight':'Neutral silver emphasis; no alarm/status material.'}
(OUT/'assembly-states.json').write_text(json.dumps(payload,indent=2));bpy.data.texts.new('Assembly states').write(json.dumps(payload,indent=2))
def view(mode):
    for name,loc in (exploded if mode=='exploded' else assembled).items():bpy.data.objects[name].location=loc
def stage(key):
    st=states[key];view(st['view'])
    for g,(c,r) in groups.items():
        c.hide_render=g not in st['visibleGroups']+['Preview']
        for o in c.objects:o.hide_render=o.name in st.get('hiddenComponents',[])
# Rig, excluded from GLB.
box('Preview_Ground',(0,0,-.48),(200,200,.1),floor,'Preview')
world=bpy.data.worlds.new('Studio');s.world=world;world.use_nodes=True;bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.2,.23,.27,1);bg.inputs[1].default_value=.5
for name,loc,power,size in [('Key',(-5,-7,10),1700,6),('Fill',(7,-1,7),1000,5),('Rim',(0,7,9),1500,5)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('Hero');cam=bpy.data.objects.new('Hero',d);groups['Preview'][0].objects.link(cam);cam.location=(10,-13,9);cam.rotation_euler=(Vector((0,0,1.5))-cam.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=12.8;s.camera=cam
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1400;s.render.resolution_y=1050;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
for a in bpy.context.screen.areas:
    if a.type=='VIEW_3D':a.spaces.active.region_3d.view_perspective='CAMERA'
for mobile in [False,True]:
    if mobile:
        for o in fine:
            bpy.context.view_layer.objects.active=o;m=o.modifiers.new('Mobile bolts','DECIMATE');m.ratio=.4;bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.select_all(action='DESELECT')
    for g,(c,r) in groups.items():
        if g!='Preview':
            for o in c.objects:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/('dfma-mobile.glb' if mobile else 'dfma.glb')),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
    if not mobile:
        stage('installation');bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'dfma.blend'))
        for c,r in groups.values():c.hide_render=False
for key in states:
    stage(key);s.render.filepath=str(OUT/('stage-'+key+'.png'));bpy.ops.render.render(write_still=True)
stage('installation');view('exploded');s.render.filepath=str(OUT/'dfma-exploded-render.png');bpy.ops.render.render(write_still=True)
view('assembled');s.render.resolution_x=1000;s.render.resolution_y=1100;d.ortho_scale=12.8
s.render.filepath=str(OUT/'dfma-mobile-render.png');bpy.ops.render.render(write_still=True)
print('DFMA_COMPLETE')

