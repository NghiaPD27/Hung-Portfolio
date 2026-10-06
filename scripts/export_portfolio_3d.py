"""Export the user-supplied Blender scenes into compact, interactive web models.

Run with Blender 5: blender -b SOURCE.blend --python scripts/export_portfolio_3d.py -- KIND OUTPUT.glb
The original .blend files are never modified.
"""

import os
import sys

import bpy


kind, output = sys.argv[sys.argv.index("--") + 1:]
os.makedirs(os.path.dirname(output), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")

if kind == "can":
    keep = lambda obj: obj.type in {"MESH", "CURVE"} and obj.name != "Studio ground"
elif kind == "bottle":
    keep = lambda obj: obj.name in {"Cylinder", "glass"}
elif kind == "house":
    omitted = {"Outdoor Armchair Seating Set", "Cinematic Lighting", "Ten Cinematic Views", "Four Exterior Views"}
    keep = lambda obj: obj.type in {"MESH", "CURVE", "EMPTY"} and not obj.hide_render and not any(
        collection.name in omitted for collection in obj.users_collection
    )
    # The cinematic source is texture-rich. Half-size maps keep the interactive
    # interior practical on phones while preserving the supplied full-size art.
    for image in bpy.data.images:
        width, height = image.size
        if image.source == "FILE" and width and height and max(width, height) > 512:
            factor = 512 / max(width, height)
            image.scale(max(1, round(width * factor)), max(1, round(height * factor)))
    # Subdivision is excellent for offline renders but excessive for real-time WebGL.
    for obj in bpy.data.objects:
        for modifier in obj.modifiers:
            if modifier.type == "SUBSURF":
                modifier.show_render = False
else:
    raise ValueError(f"Unknown model kind: {kind}")

selected = [obj for obj in bpy.context.scene.objects if keep(obj)]
for obj in selected:
    obj.select_set(True)
if selected:
    bpy.context.view_layer.objects.active = selected[0]

print("EXPORTING", kind, "OBJECTS", len(selected), "TO", output, flush=True)
bpy.ops.export_scene.gltf(
    filepath=output,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_image_format="AUTO",
    export_image_quality=68,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
)
print("EXPORTED", kind, os.path.getsize(output), flush=True)
