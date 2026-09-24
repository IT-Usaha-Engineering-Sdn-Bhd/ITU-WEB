"""Illustrative exterior campus; run with Blender 5.2 in background mode."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/models/homepage-campus';OUT.mkdir(parents=True,exist_ok=True)
SOURCE=ROOT/'public/models/data-centre/data-centre.blend'
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
# Reuse actual service-family materials, without its interior meshes.
with bpy.data.libraries.load(str(SOURCE),link=False) as (src,dst):
    dst.materials=['Warm mineral shell','Graphite powdercoat','Brushed aluminium','Safety orange','Inactive instrument glass','Vent recess']
shell,dark,metal,orange,glass,black=dst.materials
def mat(name,color,rough=.7):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    n=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    n.inputs['Base Color'].default_value=(*color,1);n.inputs['Roughness'].default_value=rough
    return m
concrete=mat('Campus pale paving',(.36,.38,.36))
asphalt=mat('Campus graphite asphalt',(.055,.067,.072))
green=mat('Campus mineral planting',(.115,.17,.13))
groups={}
for name in ['Campus_Buildings','Campus_Site','Campus_Accents','Preview']:
    c=bpy.data.collections.new(name);s.collection.children.link(c)
    root=bpy.data.objects.new(name,None);c.objects.link(root);groups[name]=(c,root)
def attach(o,name,group,material):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    groups[group][0].objects.link(o);o.parent=groups[group][1];o.data.materials.append(material)
    o['illustrative']=True
    return o
def box(name,loc,size,material,group='Campus_Buildings',bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    attach(o,name,group,material)
    if bevel:
        m=o.modifiers.new('Edge bevel','BEVEL');m.width=bevel;m.segments=2
        bpy.ops.object.modifier_apply(modifier=m.name)
    return o
def cylinder(name,loc,r,depth,material,group='Campus_Buildings',vertices=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc)
    return attach(bpy.context.object,name,group,material)
def join(parts,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();parts[0].name=name
    return parts[0]

# Compact site plinth: conceptual scale, no claim of an actual company location.
box('Campus_Site_Foundation',(0,0,-.65),(62,44,1.3),dark,'Campus_Site',.45)
box('Campus_Site_Paving',(0,0,.025),(61,43,.15),concrete,'Campus_Site',.2)
box('Campus_Site_FrontAccess',(0,-16,.12),(60,7,.07),asphalt,'Campus_Site')
box('Campus_Site_ServiceAccess',(25,1.5,.12),(7,28,.07),asphalt,'Campus_Site')
mark=[]
for x in range(-26,29,7):mark.append(box('Route dash',(x,-16,.162),(2.4,.12,.012),shell,'Campus_Site'))
join(mark,'Campus_Site_AccessMarkings')
box('Campus_Site_Kerb_Front',(-4.25,-11.8,.2),(51.5,.22,.2),shell,'Campus_Site')
box('Campus_Site_Kerb_Outer',(0,-20,.2),(60,.22,.2),shell,'Campus_Site')

def building(name,x,y,w,d,h):
    box(name+'_Shell',(x,y,h/2+.15),(w,d,h),shell,bevel=.12)
    box(name+'_Plinth',(x,y,.45),(w+.28,d+.28,.6),dark)
    box(name+'_Roof',(x,y,h+.2),(w+.35,d+.35,.3),dark)
    for yy in [y-d/2,y+d/2]:box(name+'_RoofEdge',(x,yy,h+.6),(w+.4,.22,.55),metal)
    for xx in [x-w/2,x+w/2]:box(name+'_RoofEdge',(xx,y,h+.6),(.22,d,.55),metal)
    bays=[]
    for i in range(int(w/2.8)+1):
        xx=x-w/2+.5+i*2.65
        if xx>x+w/2-.4:continue
        bays.append(box('Facade mullion',(xx,y-d/2-.13,h/2+.25),(.12,.22,h-.5),metal))
    for z in [2.5,5,7.5]:
        if z<h:bays.append(box('Facade reveal',(x,y-d/2-.04,z),(w,.07,.055),dark))
    for j in range(int(d/2.5)):
        bays.append(box('Side reveal',(x+w/2+.03,y-d/2+.6+j*2.5,h/2+.25),(.08,.07,h-.5),dark))
    join(bays,name+'_FacadeBays')
    return h+.38

roof=building('Campus_Buildings_MainHall',-4,5,31,22,10)
annex=building('Campus_Buildings_SecondaryHall',-21,6,9,18,6)
building('Campus_Buildings_Utility',18,10,8,11,4.6)
# Front entrance volume and opaque glazing maintain low cost and robust shadows.
box('Campus_Buildings_Entrance',(-7,-8,2.45),(13,5,4.6),dark,bevel=.1)
box('Campus_Buildings_EntranceGlass',(-7,-10.53,2.45),(11.8,.08,3.5),glass)
frames=[]
for x in [-12.7,-10.8,-8.9,-7,-5.1,-3.2,-1.3]:frames.append(box('Entrance frame',(x,-10.62,2.5),(.075,.10,3.65),metal))
join(frames,'Campus_Buildings_EntranceFrames')
box('Campus_Accents_EntranceCanopy',(-7,-10.1,4.9),(14,3.5,.25),orange,'Campus_Accents',.05)
box('Campus_Accents_FacadeBlade',(10.8,-6.18,5.2),(.35,.35,9.7),orange,'Campus_Accents')
for i,x in enumerate([2.5,6.5]):
    box(f'Campus_Buildings_ServiceDoor_{i+1}',(x,-6.09,1.85),(2.9,.12,3.4),dark)
    lines=[]
    for z in [.5+j*.37 for j in range(8)]:lines.append(box('Door slat',(x,-6.17,z),(2.7,.055,.045),metal))
    join(lines,f'Campus_Buildings_ServiceDoorSlats_{i+1}')

# Low-poly rooftop plant silhouettes, with modeled fans and louvres.
for i,(x,y) in enumerate([(-12,3),(-4,3),(4,3),(-12,11),(-4,11),(4,11)],1):
    parts=[box('Plant pedestal',(x,y,roof+.22),(5,3.5,.4),metal),box('Plant casing',(x,y,roof+1.1),(4.7,3.1,1.5),dark,bevel=.07)]
    for dx in [-1.15,1.15]:
        parts.append(cylinder('Fan ring',(x+dx,y,roof+1.88),.92,.1,metal,vertices=16))
        parts.append(cylinder('Fan inset',(x+dx,y,roof+1.95),.78,.045,black,vertices=16))
        parts.append(cylinder('Fan hub',(x+dx,y,roof+2.0),.18,.07,metal))
        for a in range(4):
            ang=a*math.pi/2
            o=box('Fan blade',(x+dx+.4*math.cos(ang),y+.4*math.sin(ang),roof+2.0),(.68,.18,.05),metal);o.rotation_euler.z=ang+.3;parts.append(o)
    for z in [roof+.65+j*.25 for j in range(4)]:parts.append(box('Plant louvre',(x,y-1.58,z),(4.4,.06,.065),metal))
    join(parts,f'Campus_Buildings_RoofPlant_{i:02d}')
box('Campus_Buildings_RoofSpine',(-4,7,roof+.6),(24,1.1,1),metal,bevel=.1)
# Sparse planters and bollards suggest access context without dense foliage.
for i,(x,y,w) in enumerate([(-21,-9,8),(17,-9,7),(-20,-19,10),(18,-19,10)],1):
    box(f'Campus_Site_Planter_{i}',(x,y,.4),(w,1.4,.7),dark,'Campus_Site',.12)
    box(f'Campus_Site_Planting_{i}',(x,y,.8),(w-.4,1.05,.35),green,'Campus_Site',.16)
for i,x in enumerate([-14,-11,-3,0,13,16]):
    cylinder(f'Campus_Accents_Bollard_{i}',(x,-11.4,.65),.12,1.15,metal,'Campus_Accents')
    cylinder(f'Campus_Accents_BollardBand_{i}',(x,-11.4,1.07),.125,.12,orange,'Campus_Accents')

ground=mat('Campus studio background',(.045,.057,.067))
box('Preview_ShadowGround',(0,0,-1.45),(2000,2000,.2),ground,'Preview')
world=bpy.data.worlds.new('Campus studio');s.world=world;world.use_nodes=True
bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.19,.22,.26,1);bg.inputs[1].default_value=.5
for name,loc,power,size in [('Key',(-35,-45,65),55000,35),('Fill',(45,-10,35),25000,25),('Rim',(10,40,50),45000,30)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size
    o=bpy.data.objects.new(name,data);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
data=bpy.data.cameras.new('Campus hero camera');camera=bpy.data.objects.new('Campus hero camera',data);groups['Preview'][0].objects.link(camera)
camera.location=(80,-110,86);target=Vector((0,0,2));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=135
# Lens shift allocates left-hand copy space without offsetting model coordinates.
data.shift_x=-.19;s.camera=camera
s.render.engine='CYCLES';s.cycles.samples=32;s.cycles.use_denoising=True
s.render.resolution_x=1800;s.render.resolution_y=1000;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.object.select_all(action='DESELECT')
for name,(collection,root) in groups.items():
    if name!='Preview':
        for o in collection.objects:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'homepage-campus.glb'),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_meshopt_compression_enable=True,export_meshopt_extension='EXT_meshopt_compression')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'homepage-campus.blend'))
s.render.filepath=str(OUT/'homepage-campus-render.png');bpy.ops.render.render(write_still=True)
# Independent light arrangement confirms shadow and material response.
bpy.data.objects['Key'].location=(40,-5,50);bpy.data.lights['Key'].energy=70000
bpy.data.lights['Fill'].energy=2000;bpy.data.lights['Rim'].energy=2000
s.render.resolution_x=1000;s.render.resolution_y=556;s.cycles.samples=16
s.render.filepath=str(OUT/'homepage-campus-lighting-check.png');bpy.ops.render.render(write_still=True)
print('CAMPUS_COMPLETE')
