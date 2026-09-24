"""Run with Blender --background --python; texture-free, editable service cutaway."""
import bpy, math, json, shutil
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parents[1] / 'public/models/data-centre'
backup = OUT / 'originals'
backup.mkdir(exist_ok=True)
for name in ['data-centre.blend','data-centre.glb','data-centre.README.md']:
    if not (backup/name).exists(): shutil.copy2(OUT/name, backup/name)
bpy.ops.wm.read_factory_settings(use_empty=True)
s = bpy.context.scene
s.unit_settings.system = 'METRIC'
s.unit_settings.scale_length = 1
groups = {}
for name in ['Architecture','Power','Cooling','Protection','Controls','Preview']:
    c = bpy.data.collections.new(name); s.collection.children.link(c)
    root = bpy.data.objects.new(name,None); c.objects.link(root)
    groups[name] = (c,root)

def material(name,color,metal=0,rough=.5):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    n=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    n.inputs['Base Color'].default_value=(*color,1)
    n.inputs['Metallic'].default_value=metal; n.inputs['Roughness'].default_value=rough
    return m
shell=material('Warm mineral shell',(.49,.48,.43),0,.78)
floor=material('Raised floor porcelain',(.27,.30,.30),.12,.65)
dark=material('Graphite powdercoat',(.027,.039,.045),.45,.38)
metal=material('Brushed aluminium',(.34,.4,.43),.8,.32)
orange=material('Safety orange',(.85,.19,.035),.25,.4)
black=material('Vent recess',(.008,.013,.016),.1,.75)
blue=material('Cooling circuit muted blue',(.07,.25,.31),.5,.35)
red=material('Fire protection oxide',(.40,.055,.025),.25,.4)
screen=material('Inactive instrument glass',(.025,.09,.10),.35,.21)
white=material('Equipment ceramic',(.64,.68,.65),.15,.45)
detail=[]

def attach(o,name,group,mat):
    o.name=name
    for c in list(o.users_collection): c.objects.unlink(o)
    groups[group][0].objects.link(o); o.parent=groups[group][1]
    o.data.materials.append(mat)
    o['system']=group; o['illustrative']=True
    return o

def box(name,loc,size,mat,group='Architecture',bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object; o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    attach(o,name,group,mat)
    if bevel:
        mod=o.modifiers.new('Manufactured edge','BEVEL'); mod.width=bevel; mod.segments=2
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
        for poly in o.data.polygons: poly.use_smooth=False
    return o

def pipe(name,a,b,r,mat,group,verts=10):
    a,b=Vector(a),Vector(b); d=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=d.length,location=(a+b)/2)
    o=bpy.context.object; o.rotation_euler=d.to_track_quat('Z','Y').to_euler()
    return attach(o,name,group,mat)

def merge(parts,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]; bpy.ops.object.join()
    parts[0].name=name
    return parts[0]

box('Architecture_Foundation',(0,0,-.22),(12.6,9.6,.44),dark,bevel=.08)
box('Architecture_RaisedFloor',(0,0,-.045),(12,9,.16),floor)
box('Architecture_RearWall',(0,4.5,1.7),(12.3,.18,3.5),shell)
box('Architecture_LeftWall',(-6,1.6,1.2),(.18,5.8,2.5),shell)
box('Architecture_RearCoping',(0,4.5,3.48),(12.4,.27,.12),metal)
for x in [-5.85,0,5.85]:box('Architecture_Structure_'+str(x),(x,4.32,1.72),(.16,.2,3.45),metal)
seams=[]
for x in range(-5,6):seams.append(box('Tile joint',(x,0,.039),(.012,9,.005),black))
for y in range(-4,5):seams.append(box('Tile joint',(0,y,.039),(12,.012,.005),black))
merge(seams,'Architecture_FloorJoints')
for x in [-3.25,.05,3.35]:
    box('Architecture_AisleMarker_'+str(x),(x,-.5,.045),(.045,6.4,.006),orange)

# Two four-rack aisles, fronts toward the open cutaway.
for row,y in enumerate([-.9,1.6],1):
    for col,x in enumerate([-4.1,-2.7,-1.3,.1],1):
        name=f'Power_RackAisle_{row:02d}_Rack_{col:02d}'
        parts=[box(name,(x,y,1.13),(.91,1.12,2.16),dark,'Power',.025),
               box('Door recess',(x,y-.572,1.15),(.76,.025,1.93),black,'Power'),
               box('Rack header',(x,y-.595,2.11),(.74,.035,.065),metal,'Power'),
               box('Rack handle',(x+.34,y-.61,1.18),(.025,.025,.24),metal,'Power')]
        for z in [.33+i*.17 for i in range(10)]:
            parts.append(box('Server',(x,y-.596,z),(.70,.025,.135),dark,'Power'))
            parts.append(box('Drive',(x-.17,y-.614,z),(.25,.012,.025),metal,'Power'))
            parts.append(box('Latch',(x+.27,y-.615,z),(.032,.012,.035),orange,'Power'))
        merge(parts,name)
        fins=[]
        for z in [.32+i*.085 for i in range(21)]:fins.append(box('Vent',(x+.06,y-.615,z),(.15,.009,.011),black,'Power'))
        detail.append(merge(fins,name+'_FineVents'))

# Ladder trays and continuous busbars feed the rack rows.
for row,y in enumerate([-.9,1.6],1):
    parts=[]
    for yy in [y-.29,y+.29]:parts.append(box('Tray rail',(-1.7,yy,2.82),(7,.04,.13),metal,'Power'))
    for x in [-5+i*.32 for i in range(22)]:parts.append(box('Tray rung',(x,y,2.77),(.035,.6,.035),metal,'Power'))
    parts.append(box('Busbar',(-1.7,y,2.84),(7,.16,.12),orange,'Power'))
    for x in [-4.1,-2.7,-1.3,.1]:parts.append(pipe('Rack drop',(x,y,2.78),(x,y,2.21),.028,dark,'Power'))
    merge(parts,f'Power_OverheadDistribution_{row:02d}')
box('Power_DistributionLink',(1.72,.35,2.84),(.16,2.66,.12),orange,'Power')
for i,x in enumerate([2.0,3.1,4.2]):
    parts=[box('Cabinet',(x,3.63,1.15),(.94,.65,2.2),dark,'Power',.025),box('Door',(x,3.285,1.15),(.84,.025,1.94),metal,'Power'),box('Meter',(x,3.26,1.7),(.26,.02,.2),screen,'Power'),box('Handle',(x+.28,3.24,1.12),(.04,.04,.22),dark,'Power')]
    merge(parts,['Power_UPS_01','Power_Switchboard_01','Power_DistributionPanel_01'][i])
pipe('Power_Feeder',(1.72,1.6,2.84),(1.72,3.7,2.84),.055,orange,'Power')
pipe('Power_PanelDrop',(1.72,3.7,2.84),(1.72,3.7,2.25),.055,orange,'Power')

# Cooling units with actual grille recesses, pipe risers and fan geometry.
for i,y in enumerate([-2.25,.15],1):
    parts=[box('AHU',(4.65,y,1.13),(1.2,1.45,2.16),white,'Cooling',.04),box('Intake',(4.65,y-.739,1.05),(.97,.025,1.5),black,'Cooling')]
    for z in [.40+j*.115 for j in range(12)]:parts.append(box('Louvre',(4.65,y-.768,z),(.99,.055,.035),metal,'Cooling'))
    parts.append(box('Panel',(4.65,y-.77,1.95),(.38,.02,.12),screen,'Cooling'))
    parts.append(pipe('Fan shroud',(4.65,y,2.20),(4.65,y,2.25),.40,dark,'Cooling',24))
    parts.append(pipe('Fan hub',(4.65,y,2.25),(4.65,y,2.29),.09,metal,'Cooling',12))
    for a in range(5):
        angle=a*math.tau/5
        blade=box('Fan blade',(4.65+.20*math.cos(angle),y+.20*math.sin(angle),2.26),(.31,.10,.025),metal,'Cooling');blade.rotation_euler.z=angle+.3;parts.append(blade)
    merge(parts,f'Cooling_AHU_{i:02d}')
for j,x in enumerate([5.55,5.78]):
    parts=[pipe('Header',(x,-3,2.9),(x,3.6,2.9),.065,blue if j==0 else metal,'Cooling')]
    for y in [-2.25,.15]:
        parts.append(pipe('Branch',(x,y,2.9),(4.96,y,2.9),.045,blue,'Cooling'))
        parts.append(pipe('Riser',(4.96,y,2.9),(4.96,y,2.18),.045,blue,'Cooling'))
    merge(parts,f'Cooling_PipeCircuit_{j+1:02d}')

parts=[pipe('Main',(-5.5,3.95,3.15),(5.6,3.95,3.15),.038,red,'Protection')]
for x in [-4.8,-1.5,1.65]:
    parts.append(pipe('Branch',(x,3.95,3.15),(x,-3.2,3.15),.026,red,'Protection'))
    for y in [-2.8,.1,2.8]:
        parts.append(pipe('Sprinkler drop',(x,y,3.15),(x,y,3.02),.018,metal,'Protection'))
        parts.append(pipe('Sprinkler head',(x,y,3.02),(x,y,2.99),.065,metal,'Protection'))
merge(parts,'Protection_SprinklerNetwork_01')
for i,x in enumerate([-5.45,-4.98],1):
    parts=[pipe('Cylinder',(x,3.72,.12),(x,3.72,1.52),.17,red,'Protection',16),pipe('Valve',(x,3.72,1.52),(x,3.72,1.7),.045,metal,'Protection')]
    merge(parts,f'Protection_SuppressionCylinder_{i:02d}')
box('Protection_FirePanel',(-5.83,2.55,1.5),(.16,.5,.65),red,'Protection',.02)
box('Controls_BMSPanel',(.2,4.32,1.75),(.9,.13,.7),dark,'Controls',.02)
box('Controls_BMSDisplay',(.2,4.24,1.77),(.73,.025,.45),screen,'Controls')
for i,x in enumerate([-4,0,4],1):
    pipe(f'Controls_Sensor_{i:02d}',(x,4.29,2.6),(x,4.17,2.6),.075,white,'Controls',12)
for i,x in enumerate([-5.65,5.65],1):
    box(f'Controls_CameraMount_{i:02d}',(x,4.13,2.9),(.09,.45,.09),metal,'Controls')
    box(f'Controls_SecurityCamera_{i:02d}',(x,3.86,2.85),(.18,.32,.16),white,'Controls',.025)
    pipe(f'Controls_CameraLens_{i:02d}',(x,3.68,2.85),(x,3.66,2.85),.05,black,'Controls',12)
box('Controls_AccessReader',(-5.87,-1.2,1.1),(.09,.14,.25),dark,'Controls')

# Studio rig is excluded from GLBs; surfaces remain physically lit, never baked.
box('Preview_Ground',(0,0,-.52),(200,200,.12),material('Studio background',(.085,.10,.115),0,.8),'Preview')
world=bpy.data.worlds.new('Neutral studio'); s.world=world; world.use_nodes=True
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.17,.20,.24,1)
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs[1].default_value=.45
for name,loc,energy,size in [('Key',(-6,-7,12),2300,7),('Fill',(7,-1,9),1600,6),('Rim',(1,7,10),2000,5)]:
    data=bpy.data.lights.new(name,'AREA'); data.energy=energy; data.shape='DISK';data.size=size
    o=bpy.data.objects.new(name,data);groups['Preview'][0].objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Hero camera'); camera=bpy.data.objects.new('Hero camera',cam);groups['Preview'][0].objects.link(camera)
camera.location=(13,-18,14); target=Vector((0,.3,1));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler();cam.type='ORTHO';cam.ortho_scale=18.2;s.camera=camera
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True
s.render.resolution_x=1400;s.render.resolution_y=1050;s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG'
s.render.film_transparent=False
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'

def export(name,mobile=False):
    bpy.ops.object.select_all(action='DESELECT')
    for group,(c,root) in groups.items():
        if group=='Preview':continue
        for o in c.objects:
            if mobile and o in detail:continue
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False)
export('data-centre-raw.glb')
export('data-centre-mobile-raw.glb',True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'data-centre-working.blend'))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'data-centre.blend'))
s.render.filepath=str(OUT/'data-centre-render.png');bpy.ops.render.render(write_still=True)
s.render.resolution_x=900;s.render.resolution_y=1000;cam.ortho_scale=18.1
s.render.filepath=str(OUT/'data-centre-mobile-render.png');bpy.ops.render.render(write_still=True)
print('CUTAWAY_COMPLETE')
