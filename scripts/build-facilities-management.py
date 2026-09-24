"""Self-contained illustrative distribution asset, Blender 5.2."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/models/facilities-management';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
with bpy.data.libraries.load(str(ROOT/'public/models/data-centre/data-centre.blend'),link=False) as (a,b):
    b.materials=['Warm mineral shell','Graphite powdercoat','Brushed aluminium','Safety orange','Inactive instrument glass','Vent recess','Raised floor porcelain']
shell,dark,metal,orange,glass,black,floor=b.materials
names=['Architecture','Maintenance_Cooling','Maintenance_Electrical','Maintenance_Monitoring','Maintenance_General','Preview'];groups={}
for name in names:
    c=bpy.data.collections.new(name);s.collection.children.link(c);root=bpy.data.objects.new(name,None);c.objects.link(root);groups[name]=(c,root)
def attach(o,name,group,mat):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    groups[group][0].objects.link(o);o.parent=groups[group][1];o.data.materials.append(mat);o['illustrative']=True
    return o
def box(name,p,d,mat,group='Architecture',bevel=0):
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

cool,electrical,monitor,general=names[1:5]
box('Architecture_Base',(0,0,-.23),(13,10,.46),dark,bevel=.09)
box('Architecture_Floor',(0,0,.035),(12.7,9.7,.1),floor)
box('Architecture_RearWall',(0,4.5,1.6),(12.7,.18,3.2),shell)
box('Architecture_LeftWall',(-6.25,1.5,1.0),(.18,6,2),shell)
box('Architecture_Coping',(0,4.5,3.23),(12.8,.26,.12),metal)
fine=[];targets={cool:[],electrical:[],monitor:[],general:[]}
def target(o,g):targets[g].append(o.name);return o
# Cooling cabinet bodies, separately selectable maintenance panels and fittings.
for i,x in enumerate([-4.3,-1.5],1):
    box(f'Cooling_Plinth_{i:02d}',(x,2.1,.2),(2.3,2.2,.24),shell,cool)
    parts=[box('AHU',(x,2.1,1.4),(2.1,1.8,2.3),dark,cool,.035),box('Intake',(x,1.175,1.55),(1.8,.045,1.65),black,cool)]
    for dx in [-.48,.48]:
        parts.append(cyl('Fan shroud',(x+dx,2.1,2.57),(x+dx,2.1,2.64),.39,metal,cool,20))
        parts.append(cyl('Fan inset',(x+dx,2.1,2.65),(x+dx,2.1,2.68),.32,black,cool,20))
    join(parts,f'Cooling_Unit_{i:02d}')
    target(box(f'Cooling_FilterAccess_{i:02d}',(x,1.14,.62),(1.83,.05,.45),metal,cool),cool)
    vents=[]
    for j in range(12):vents.append(box('Louvre',(x,1.135,1+j*.115),(1.77,.07,.035),metal,cool))
    fine.append(join(vents,f'Cooling_Louvres_{i:02d}'))
for i,y in enumerate([3.4,3.8],1):
    parts=[cyl('Header',(-5.5,y,2.9),(.4,y,2.9),.07,metal,cool)]
    for x in [-4.3,-1.5]:
        parts.append(cyl('Branch',(x,y,2.9),(x,2.55,2.9),.045,metal,cool));parts.append(cyl('Drop',(x,2.55,2.9),(x,2.55,2.57),.045,metal,cool))
    join(parts,f'Cooling_PipeCircuit_{i:02d}')
    target(join([cyl('Valve body',(.1,y,2.9),(.1,y,3.06),.055,metal,cool),cyl('Handwheel',(.1,y,3.05),(.1,y,3.10),.14,metal,cool)],f'Cooling_IsolationValve_{i:02d}'),cool)
# Electrical boards and service door objects.
for i,x in enumerate([2.6,3.75,4.9],1):
    box(f'Electrical_Cabinet_{i:02d}',(x,2.7,1.35),(1.02,1.2,2.5),dark,electrical,.03)
    target(box(f'Electrical_ServiceDoor_{i:02d}',(x,2.075,1.35),(.9,.045,2.3),metal,electrical),electrical)
    box(f'Electrical_Handle_{i:02d}',(x+.31,2.035,1.2),(.035,.04,.25),black,electrical)
    box(f'Electrical_BlankInstrument_{i:02d}',(x,2.038,1.95),(.27,.022,.19),glass,electrical)
join([box('Tray',(3.75,2.7,2.92),(3.65,.38,.14),metal,electrical),cyl('Feeder',(2.6,2.7,2.85),(2.6,2.7,2.62),.045,dark,electrical)],'Electrical_OverheadFeeder_01')
# Physical monitoring devices have no live readings or alarm indicators.
target(box('Monitoring_Controller_01',(1,4.34,1.8),(.9,.15,.7),metal,monitor,.02),monitor)
box('Monitoring_BlankDisplay_01',(1,4.25,1.8),(.64,.025,.39),glass,monitor)
for i,x in enumerate([-4,4],1):target(cyl(f'Monitoring_RoomSensor_{i:02d}',(x,4.35,2.55),(x,4.2,2.55),.11,shell,monitor),monitor)
target(join([box('Camera mount',(5.8,4.13,2.8),(.09,.5,.09),metal,monitor),box('Camera housing',(5.8,3.85,2.75),(.2,.35,.17),shell,monitor,.025),cyl('Lens',(5.8,3.66,2.75),(5.8,3.64,2.75),.055,black,monitor)],'Monitoring_SecurityCamera_01'),monitor)
# General maintenance: clear access aisle, floor inspection cover and work cart.
parts=[]
for x in [-5.45,5.55]:parts.append(box('Aisle boundary',(x,-1,.092),(.045,3.8,.008),metal,general))
target(join(parts,'General_AccessClearance_01'),general)
target(box('General_FloorInspectionCover_01',(1,-1,.095),(1.05,.85,.025),metal,general),general)
parts=[box('Cart shelf',(-3,-2.45,.92),(1.2,.7,.07),metal,general),box('Tool case',(-3,-2.45,1.08),(.7,.44,.24),dark,general,.025)]
for x in [-3.5,-2.5]:
    for y in [-2.68,-2.22]:
        parts.append(cyl('Leg',(x,y,.18),(x,y,.92),.024,metal,general));parts.append(cyl('Wheel',(x,y-.05,.16),(x,y+.05,.16),.11,black,general))
join(parts,'General_MaintenanceCart_01')
anchors={}
for g,loc,label in [(cool,(-1.5,1,1),'Cooling service access and pipe fittings'),(electrical,(3.75,1.9,1.5),'Electrical enclosure inspection access'),(monitor,(1,4.1,2.3),'Monitoring device inspection'),(general,(1,-1,.35),'Floor access and maintenance circulation')]:
    name='Anchor_'+g.replace('Maintenance_','');o=bpy.data.objects.new(name,None);groups[g][0].objects.link(o);o.parent=groups[g][1];o.location=loc;o['label']=label;anchors[name]={'group':g,'position':[loc[0],loc[2],-loc[1]],'label':label}
states={'neutral':{'highlighted':[]}}
for g in targets:states[g.replace('Maintenance_','').lower()]={'highlighted':targets[g],'anchor':'Anchor_'+g.replace('Maintenance_','')}
payload={'states':states,'anchors':anchors};(OUT/'maintenance-states.json').write_text(json.dumps(payload,indent=2));bpy.data.texts.new('Maintenance states').write(json.dumps(payload,indent=2))
original={name:[m for m in bpy.data.objects[name].data.materials] for ids in targets.values() for name in ids}
def state(key):
    active=states[key]['highlighted']
    for name,mats in original.items():
        for i,mat in enumerate(mats):bpy.data.objects[name].material_slots[i].material=orange if name in active else mat
# Preview lights and ground excluded from exports.
box('Preview_Ground',(0,0,-.56),(200,200,.1),dark,'Preview')
world=bpy.data.worlds.new('Studio');s.world=world;world.use_nodes=True;bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.2,.23,.27,1);bg.inputs[1].default_value=.5
for name,loc,power,size in [('Key',(-7,-9,14),3200,8),('Fill',(9,-1,10),1900,6),('Rim',(0,8,12),2600,6)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
def camera(name,loc,target,scale):
    d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=scale;return o
hero=camera('Hero',(12,-18,14),(0,0,1),19.5);camera('Inspection',(-9,-12,9),(-1,1,1.3),13);s.camera=hero
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1400;s.render.resolution_y=1050;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
for a in bpy.context.screen.areas:
    if a.type=='VIEW_3D':a.spaces.active.region_3d.view_perspective='CAMERA'
for mobile in [False,True]:
    if mobile:
        for o in fine:
            bpy.context.view_layer.objects.active=o;m=o.modifiers.new('Mobile louvres','DECIMATE');m.ratio=.4;bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.select_all(action='DESELECT')
    for name,(c,r) in groups.items():
        if name!='Preview':
            for o in c.objects:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/('facilities-management-mobile.glb' if mobile else 'facilities-management.glb')),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
    if not mobile:bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'facilities-management.blend'))
for key in states:
    state(key);s.render.filepath=str(OUT/('state-'+key+'.png'));bpy.ops.render.render(write_still=True)
state('neutral');s.render.resolution_x=1000;s.render.resolution_y=1100;hero.data.ortho_scale=21
s.render.filepath=str(OUT/'facilities-management-mobile-render.png');bpy.ops.render.render(write_still=True)
print('FACILITIES_COMPLETE')

