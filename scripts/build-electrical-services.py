"""Self-contained illustrative distribution asset, Blender 5.2."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/models/electrical-services';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
with bpy.data.libraries.load(str(ROOT/'public/models/data-centre/data-centre.blend'),link=False) as (a,b):
    b.materials=['Warm mineral shell','Graphite powdercoat','Brushed aluminium','Safety orange','Inactive instrument glass','Vent recess','Raised floor porcelain']
shell,dark,metal,orange,glass,black,floor=b.materials
names=['Architecture','Primary_Supply','Backup_Supply','UPS','Low_Voltage_Distribution','Outgoing_Supply','Preview'];groups={}
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
mobile_detail=[]
box('Architecture_Foundation',(0,0,-.25),(18,10,.5),dark,bevel=.1)
box('Architecture_Paving',(0,0,.025),(17.7,9.7,.08),floor)
box('Architecture_BackWall',(0,4.75,1.15),(17.8,.15,2.3),shell)
box('Architecture_BackCoping',(0,4.75,2.34),(17.9,.22,.1),metal)
for i,(x,y,w,d) in enumerate([(-6,2.2,2.4,2.7),(-2.7,2.2,3,3),(-5,-2.3,5.1,2.4),(1.3,1,2,2.6),(4.35,1,2.6,2.6),(7.1,1,1.8,2.6)]):box(f'Architecture_EquipmentPad_{i:02d}',(x,y,.16),(w,d,.22),shell)

def cabinet(name,x,y,w,h,group):
    parts=[box('Case',(x,y,h/2+.3),(w,1.2,h),dark,group,.035),box('Door',(x,y-.618,h/2+.3),(w-.12,.03,h-.15),metal,group),box('Instrument',(x,y-.65,h*.74),(.26,.025,.18),glass,group),box('Handle',(x+w*.3,y-.67,h*.46),(.035,.04,.22),black,group)]
    return join(parts,name)
cabinet('Primary_Switchgear_01',-6.5,2.2,.85,2.6,'Primary_Supply')
cabinet('Primary_Switchgear_02',-5.55,2.2,.85,2.6,'Primary_Supply')
# Transformer: tank, corrugated radiator banks and three bushings.
parts=[box('Tank',(-2.7,2.2,1.25),(1.65,1.7,1.75),dark,'Primary_Supply',.06),box('Lid',(-2.7,2.2,2.16),(1.9,1.95,.14),metal,'Primary_Supply')]
for side in [-1,1]:
    for j in range(9):parts.append(box('Radiator',(-2.7+side*1.0,1.46+j*.185,1.25),(.35,.08,1.5),metal,'Primary_Supply'))
for x in [-3.25,-2.7,-2.15]:
    parts.append(cyl('Bushing',(x,2.2,2.2),(x,2.2,2.75),.08,shell,'Primary_Supply'))
    for z in [2.3,2.42,2.54]:parts.append(cyl('Insulator',(x,2.2,z),(x,2.2,z+.06),.13,shell,'Primary_Supply'))
join(parts,'Primary_Transformer_01')
# Backup generator with canopy, radiator, exhaust and access hatches.
parts=[box('Skid',(-5,-2.3,.38),(4.7,1.95,.26),metal,'Backup_Supply'),box('Generator canopy',(-5,-2.3,1.25),(4.5,1.8,1.65),dark,'Backup_Supply',.06),box('Radiator inset',(-6.4,-3.215,1.25),(1.3,.025,1.35),black,'Backup_Supply')]
for x in [-5.1,-3.8]:
    parts.append(box('Access hatch',(x,-3.23,1.25),(1.08,.04,1.35),metal,'Backup_Supply'))
    parts.append(box('Handle',(x+.32,-3.27,1.3),(.04,.04,.2),black,'Backup_Supply'))
parts.append(cyl('Exhaust',(-3.8,-2.1,2.08),(-3.8,-2.1,2.75),.09,metal,'Backup_Supply'))
parts.append(cyl('Silencer',(-3.8,-2.1,2.3),(-3.8,-2.1,2.65),.17,dark,'Backup_Supply'))
join(parts,'Backup_Generator_01')
vents=[]
for j in range(14):vents.append(box('Louvre',(-6.4,-3.255,.65+j*.087),(1.25,.07,.035),metal,'Backup_Supply'))
vent=join(vents,'Backup_GeneratorGrille_01');mobile_detail.append(vent)
cabinet('UPS_Module_01',.83,1,.8,2.35,'UPS');cabinet('UPS_BatteryCabinet_01',1.77,1,.8,2.35,'UPS')
cabinet('LV_DistributionBoard_01',3.65,1,.75,2.45,'Low_Voltage_Distribution');cabinet('LV_DistributionBoard_02',4.5,1,.75,2.45,'Low_Voltage_Distribution');cabinet('LV_DistributionBoard_03',5.35,1,.75,2.45,'Low_Voltage_Distribution')
cabinet('Outgoing_FeederPillar_01',7.1,1,1.1,1.7,'Outgoing_Supply')
# Visible segmented routes run in service space in front of equipment, no crossings.
paths={}
def route(name,points,group,active=True):
    parts=[]
    for a,b in zip(points,points[1:]):
        a,b=Vector(a),Vector(b);v=b-a
        o=box('Busbar',(a+b)/2,(.13,.13,v.length),orange if active else dark,group);o.rotation_euler=v.to_track_quat('Z','Y').to_euler();parts.append(o)
    paths[name]=join(parts,name)
route('Path_PrimaryToTransformer',[(-6,1.55,.6),(-6,.25,.6),(-2.7,.25,.6),(-2.7,1.3,.6)],'Primary_Supply')
route('Path_NormalToUPS',[(-2.35,1.3,.6),(-2.35,-.55,.6),(.63,-.55,.6),(.63,.35,.6)],'Primary_Supply')
route('Path_BackupToUPS',[(-2.75,-2.3,.6),(1.03,-2.3,.6),(1.03,.35,.6)],'Backup_Supply',False)
route('Path_UPSToLV',[(1.77,.35,.6),(1.77,-.55,.6),(3.65,-.55,.6),(3.65,.35,.6)],'UPS')
route('Path_LVToOutgoing',[(5.35,.35,.6),(5.35,-.55,.6),(6.85,-.55,.6),(6.85,.35,.6)],'Low_Voltage_Distribution')
route('Path_Outgoing',[(7.4,.35,.6),(7.4,-2.3,.6),(8.5,-2.3,.6)],'Outgoing_Supply')
normal=['Path_PrimaryToTransformer','Path_NormalToUPS','Path_UPSToLV','Path_LVToOutgoing','Path_Outgoing']
backup=['Path_BackupToUPS','Path_UPSToLV','Path_LVToOutgoing','Path_Outgoing']
def state(active):
    for name,o in paths.items():
        for slot in o.material_slots:slot.material=orange if name in active else dark
states={'normal':{'highlighted':normal,'subdued':['Path_BackupToUPS']},'backup':{'highlighted':backup,'subdued':['Path_PrimaryToTransformer','Path_NormalToUPS']}}
(OUT/'supply-states.json').write_text(json.dumps(states,indent=2))
# Reusable preview rig, not exported.
box('Preview_Ground',(0,0,-.58),(200,200,.1),dark,'Preview')
world=bpy.data.worlds.new('Studio');s.world=world;world.use_nodes=True;bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.2,.23,.27,1);bg.inputs[1].default_value=.5
for name,loc,power,size in [('Key',(-7,-9,14),3500,8),('Fill',(10,-1,10),2300,7),('Rim',(0,8,12),2800,6)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
def camera(name,loc,target,scale):
    d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=scale;return o
hero=camera('Hero',(12,-19,16),(0,0,1),23);camera('PowerPath',(0,-12,22),(0,0,.5),22);s.camera=hero
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1500;s.render.resolution_y=1000;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
for a in bpy.context.screen.areas:
    if a.type=='VIEW_3D':a.spaces.active.region_3d.view_perspective='CAMERA'
for mobile in [False,True]:
    bpy.ops.object.select_all(action='DESELECT')
    # Mobile keeps identical IDs; simplify grille geometry inside its mesh.
    if mobile:
        bpy.context.view_layer.objects.active=vent;vent.select_set(True);m=vent.modifiers.new('Mobile grille','DECIMATE');m.ratio=.45;bpy.ops.object.modifier_apply(modifier=m.name)
    for name,(c,r) in groups.items():
        if name!='Preview':
            for o in c.objects:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/('electrical-services-mobile.glb' if mobile else 'electrical-services.glb')),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
    if not mobile:bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'electrical-services.blend'))
state(normal);s.render.filepath=str(OUT/'electrical-services-render.png');bpy.ops.render.render(write_still=True)
state(backup);s.render.filepath=str(OUT/'electrical-services-backup-render.png');bpy.ops.render.render(write_still=True)
state(normal);s.render.resolution_x=1000;s.render.resolution_y=1100;hero.data.ortho_scale=24
s.render.filepath=str(OUT/'electrical-services-mobile-render.png');bpy.ops.render.render(write_still=True)
print('ELECTRICAL_COMPLETE')
