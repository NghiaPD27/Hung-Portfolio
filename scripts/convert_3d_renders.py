"""Create lightweight WebP previews from the user's 3D render folder.

Run with Blender: blender -b --python scripts/convert_3d_renders.py -- SOURCE_DIR OUTPUT_DIR
"""

import os
import sys

import bpy


source_dir, output_dir = sys.argv[sys.argv.index("--") + 1:]
os.makedirs(output_dir, exist_ok=True)
names = [
    "can_hero.png", "01_left_three_quarter.png", "02_right_three_quarter.png",
    "03_low_rear_angle.png", "can_lid_detail.png",
    "01_original.png", "02_orbit_left.png", "03_orbit_right.png", "04_high_angle.png", "05_low_angle.png",
    "House_Cinematic_01_Hero_Front_Left.png", "House_Cinematic_02_Front_Right.png",
    "House_Cinematic_03_Garden_Rear.png", "House_Cinematic_04_Roof_Terrace.png",
    "House_Cinematic_05_Living_Room.png", "House_Cinematic_06_Dining_Room.png",
    "House_Cinematic_07_Kitchen.png", "House_Cinematic_08_West_Bedroom.png",
    "House_Cinematic_09_East_Bedroom.png", "House_Cinematic_10_Bathroom.png",
]
scene = bpy.context.scene
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.quality = 82
for name in names:
    source = os.path.join(source_dir, name)
    target = os.path.join(output_dir, name[:-4] + ".webp")
    if os.path.exists(target):
        continue
    image = bpy.data.images.load(source, check_existing=False)
    image.save_render(target, scene=scene)
    bpy.data.images.remove(image)
    print("PREVIEW", name, os.path.getsize(target), flush=True)
