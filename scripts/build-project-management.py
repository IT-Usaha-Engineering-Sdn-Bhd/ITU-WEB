"""Four cumulative construction stages, Blender 5.2."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/models/project-management';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
with bpy.data.libraries.load(str(ROOT/'public/models/data-centre/data-centre.blend'),link=False) as (a,b):
    b.materials=['Warm mineral shell','Graphite powdercoat','Brushed aluminium','Safety orange','Inactive instrument glass','Vent recess','Raised floor porcelain']
shell,dark,metal,orange,glass,black,floor=b.materials
names=['Stage_Structure','Stage_Equipment','Stage_Coordination','Stage_Commissioning','Preview'];groups={}
for name in names:
    c=bpy.data.collections.new(name);s.collection.children.link(c);root=bpy.data.objects.new(name,None);c.objects.link(root);groups[name]=(c,root)
def attach(o,name,group,mat):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    groups[group][0].objects.link(o);o.parent=groups[group][1];o.data.materials.append(mat);o['illustrative']=True
    return o
def box(name,p,d,mat,group='Stage_Structure',bevel=0):
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

structure,equipment,coordination,commissioning=names[:4]
box('Structure_Foundation',(0,0,-.25),(15,11,.5),dark,bevel=.1)
box('Structure_Slab',(0,0,.025),(14.7,10.7,.12),floor)
box('Structure_RearWall',(0,4.6,1.2),(13.2,.18,2.4),shell)
box('Structure_LeftWall',(-6.5,1.7,.7),(.18,5.8,1.4),shell)
for i,x in enumerate([-6.4,0,6.4]):
    for j,y in enumerate([-3.7,4.5]):
        box(f'Structure_Column_{i}_{j}',(x,y,2),(.28,.28,4),shell)
        box(f'Structure_BasePlate_{i}_{j}',(x,y,.16),(.5,.5,.18),metal)
    box(f'Structure_RoofBeam_{i}',(x,.4,3.92),(.22,8.5,.3),metal)
for j,y in enumerate([-3.7,4.5]):box(f'Structure_Header_{j}',(0,y,3.92),(13.1,.22,.3),metal)
for i,(x,y,w,d) in enumerate([(-3,1,5,2.4),(3.3,2.2,3.2,2.3)]):box(f'Structure_EquipmentPlinth_{i}',(x,y,.16),(w,d,.2),shell)
# Fixed equipment set: four rack cabinets, cooling skid and distribution board.
fine=[]
for i,x in enumerate([-4.8,-3.6,-2.4,-1.2],1):
    parts=[box('Rack',(x,1,1.36),(.86,1.15,2.25),dark,equipment,.025),box('Door',(x,.41,1.36),(.73,.035,2.08),black,equipment)]
    for k in range(9):parts.append(box('Server drawer',(x,.38,.47+k*.2),(.68,.025,.14),metal,equipment))
    parts.append(box('Handle',(x+.31,.35,1.3),(.025,.03,.22),orange,equipment))
    join(parts,f'Equipment_Rack_{i:02d}')
    vents=[]
    for k in range(18):vents.append(box('Vent',(x,.359,.43+k*.10),(.48,.008,.018),black,equipment))
    fine.append(join(vents,f'Equipment_RackGrille_{i:02d}'))
parts=[box('Cooling cabinet',(3.4,2.2,1.35),(2.5,1.5,2.25),shell,equipment,.04),box('Grille',(3.4,1.425,1.2),(2.2,.04,1.5),black,equipment)]
for i in range(10):parts.append(box('Louvre',(3.4,1.39,.56+i*.14),(2.14,.05,.04),metal,equipment))
for x in [2.8,4]:parts.append(cyl('Fan',(x,2.2,2.49),(x,2.2,2.56),.45,dark,equipment,20))
join(parts,'Equipment_CoolingSkid_01')
parts=[box('Switchboard',(5.4,2.3,1.33),(.8,1.1,2.2),dark,equipment,.03),box('Door',(5.4,1.73,1.33),(.68,.03,2.05),metal,equipment),box('Inactive panel',(5.4,1.705,1.8),(.26,.015,.18),glass,equipment)]
join(parts,'Equipment_DistributionBoard_01')
# Coordinated services: supported tray, separated pipe runs and equipment drops.
parts=[]
for yy in [.72,1.28]:parts.append(box('Tray rail',(-2.9,yy,3.05),(6.7,.05,.15),metal,coordination))
for i in range(22):parts.append(box('Tray rung',(-6.1+i*.30,1,2.99),(.04,.58,.04),metal,coordination))
parts.append(box('Busway',(-2.9,1,3.1),(6.7,.16,.13),orange,coordination))
for x in [-4.8,-3.6,-2.4,-1.2]:parts.append(cyl('Rack drop',(x,1,3.02),(x,1,2.5),.035,dark,coordination))
for x in [-6.1,-.1]:
    for y in [.74,1.26]:parts.append(cyl('Tray suspension',(x,y,3.05),(x,y,3.85),.018,metal,coordination))
join(parts,'Coordination_OverheadDistribution_01')
join([box('Feeder',(2.9,1,3.1),(5,.16,.13),orange,coordination),cyl('Panel drop',(5.4,1,3.1),(5.4,1,2.45),.04,dark,coordination)],'Coordination_PowerFeeder_01')
for i,y in enumerate([3.25,3.55],1):
    parts=[cyl('Pipe',(-5.8,y,3.42),(4.1,y,3.42),.065,metal,coordination),cyl('Drop',(4.1,y,3.42),(4.1,y,2.56),.065,metal,coordination),cyl('Connection',(4.1,y,2.56),(4.1,2.45,2.56),.065,metal,coordination)]
    for x in [-5.6,0,4]:parts.append(cyl('Pipe support',(x,y,3.42),(x,y,3.85),.02,metal,coordination))
    join(parts,f'Coordination_CoolingCircuit_{i:02d}')
# Commissioning adds access markings, test connections and inspection equipment.
marks=[]
for x in [-5.5,.0]:marks.append(box('Aisle edge',(x,-1.35,.092),(.045,3.2,.012),orange,commissioning))
for x in [1.7,4.8]:marks.append(box('Plant clearance',(x,.65,.092),(.045,1.2,.012),orange,commissioning))
join(marks,'Commissioning_AccessClearances_01')
for i,y in enumerate([3.25,3.55],1):
    parts=[cyl('Valve stem',(2.3,y,3.42),(2.3,y,3.62),.04,metal,commissioning),cyl('Valve handwheel',(2.3,y,3.61),(2.3,y,3.66),.14,orange,commissioning)]
    join(parts,f'Commissioning_InspectionValve_{i:02d}')
parts=[box('Cart top',(3,-2,1),(1.35,.75,.08),metal,commissioning),box('Case',(3,-2,1.18),(.68,.46,.28),dark,commissioning,.03),box('Blank screen',(3,-2.24,1.19),(.4,.015,.14),glass,commissioning)]
for x in [2.45,3.55]:
    for y in [-2.25,-1.75]:
        parts.append(cyl('Leg',(x,y,.2),(x,y,1),.025,metal,commissioning))
        parts.append(cyl('Wheel',(x,y-.055,.16),(x,y+.055,.16),.12,black,commissioning))
join(parts,'Commissioning_InspectionCart_01')
box('Commissioning_TestAccessPanel_01',(5.4,1.69,.72),(.38,.04,.28),orange,commissioning)
anchors={}
for name,group,loc,label in [('Anchor_Structure',structure,(-6.4,-3.7,4.15),'Structural coordination and site readiness'),('Anchor_Equipment',equipment,(-3,1,2.7),'Equipment placement and installation coordination'),('Anchor_Coordination',coordination,(-2.9,1,3.3),'MEP routing and interface coordination'),('Anchor_Commissioning',commissioning,(3,-2,1.5),'Inspection access and commissioning coordination')]:
    o=bpy.data.objects.new(name,None);groups[group][0].objects.link(o);o.parent=groups[group][1];o.location=loc;o['responsibility']=label
    anchors[name]={'group':group,'position':[loc[0],loc[2],-loc[1]],'label':label}
states={}
for i,key in enumerate(['structure','equipment','coordination','commissioning']):states[key]={'visibleGroups':names[:i+1],'anchor':list(anchors)[i]}
payload={'states':states,'anchors':anchors}
(OUT/'stage-states.json').write_text(json.dumps(payload,indent=2));bpy.data.texts.new('Stage states').write(json.dumps(payload,indent=2))
# Preview rig, omitted from both GLBs.
box('Preview_Ground',(0,0,-.6),(200,200,.15),dark,'Preview')
world=bpy.data.worlds.new('Studio');s.world=world;world.use_nodes=True;bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.2,.23,.27,1);bg.inputs[1].default_value=.5
for name,loc,power,size in [('Key',(-7,-10,15),3800,8),('Fill',(9,-2,11),2200,7),('Rim',(0,9,12),3000,6)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('Hero');camera=bpy.data.objects.new('Hero',d);groups['Preview'][0].objects.link(camera);camera.location=(13,-19,15);camera.rotation_euler=(Vector((0,0,1.2))-camera.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=22;s.camera=camera
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1500;s.render.resolution_y=1100;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
for a in bpy.context.screen.areas:
    if a.type=='VIEW_3D':a.spaces.active.region_3d.view_perspective='CAMERA'
for mobile in [False,True]:
    if mobile:
        for o in fine:
            bpy.context.view_layer.objects.active=o;m=o.modifiers.new('Mobile grille','DECIMATE');m.ratio=.35;bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.select_all(action='DESELECT')
    for name,(c,r) in groups.items():
        if name!='Preview':
            for o in c.objects:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/('project-management-mobile.glb' if mobile else 'project-management.glb')),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
    if not mobile:bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'project-management.blend'))
for key,state in states.items():
    for name,(c,r) in groups.items():c.hide_render=name not in state['visibleGroups']+['Preview']
    s.render.filepath=str(OUT/('stage-'+key+'.png'));bpy.ops.render.render(write_still=True)
s.render.resolution_x=1000;s.render.resolution_y=1100;d.ortho_scale=23
s.render.filepath=str(OUT/'project-management-mobile-render.png');bpy.ops.render.render(write_still=True)
print('PROJECT_MANAGEMENT_COMPLETE')

